/**
 * Word (.docx) export of the CV and the cover letter, generated in the
 * browser with the docx library. The layout is a clean single column that
 * stays editable and reads well in applicant tracking systems; it uses the
 * same content, section order, headings and accent colour as the PDF.
 *
 * Loaded on demand (dynamic import) so the docx library is a separate chunk.
 */
import {
    AlignmentType,
    BorderStyle,
    Document,
    ExternalHyperlink,
    ImageRun,
    LevelFormat,
    Packer,
    Paragraph,
    Tab,
    TabStopType,
    Table,
    TableBorders,
    TableCell,
    TableRow,
    TextRun,
    VerticalAlign,
    WidthType,
} from 'docx';
import { isCoverLetterEmpty } from '../schema.js';
import { entryShape, groupSkills, join, languageLabel, normalizeUrl, prepare, skillLabel } from '../templates/common.js';

const A4 = { width: 11906, height: 16838 }; // twips
const MARGIN = 1020; // 1.8 cm
const CONTENT_WIDTH = A4.width - MARGIN * 2;
const INK = '111827';
const MUTED = '6B7280';
const BULLETS = 'krijo-bullets';

const hex = (color) => (color ?? '#C1121F').replace('#', '').toUpperCase();

function bytesFromDataUrl(dataUrl) {
    const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
    if (typeof atob === 'function') {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        return bytes;
    }
    return Uint8Array.from(globalThis.Buffer.from(base64, 'base64'));
}

function link(text, href, accent) {
    return new ExternalHyperlink({ link: href, children: [new TextRun({ text, color: accent, underline: {} })] });
}

/** Contact line: runs separated by a middle dot, links clickable. */
function contactRuns(ctx, accent) {
    const runs = [];
    ctx.contacts.forEach((contact, index) => {
        if (index) runs.push(new TextRun({ text: '   ·   ', color: MUTED }));
        runs.push(contact.link ? link(contact.text, contact.link, accent) : new TextRun({ text: contact.text, color: MUTED }));
    });
    return runs;
}

/** Description text: paragraphs and "- " bullet lines, like the PDF templates. */
function descriptionParagraphs(text) {
    const paragraphs = [];
    for (const raw of (text ?? '').replace(/\r\n?/g, '\n').split('\n')) {
        const line = raw.trim();
        if (!line) continue;
        const bullet = line.match(/^[-•*]\s+(.*)$/);
        paragraphs.push(
            bullet
                ? new Paragraph({ numbering: { reference: BULLETS, level: 0 }, spacing: { after: 40 }, children: [new TextRun(bullet[1])] })
                : new Paragraph({ spacing: { after: 60 }, children: [new TextRun(line)] }),
        );
    }
    return paragraphs;
}

function heading(text, accent) {
    return new Paragraph({
        keepNext: true,
        keepLines: true,
        spacing: { before: 280, after: 100 },
        border: { bottom: { color: accent, space: 2, style: BorderStyle.SINGLE, size: 8 } },
        children: [new TextRun({ text: text.toUpperCase(), bold: true, color: accent, size: 22, characterSpacing: 20 })],
    });
}

function entryParagraphs(ctx, section, accent) {
    const out = [];
    section.items.forEach((item, index) => {
        const shape = entryShape(section.custom ? 'custom' : section.key, item);
        const href = shape.link ? normalizeUrl(shape.link) : null;
        const titleText = shape.primary || shape.secondary || '';
        const titleRun = href
            ? new ExternalHyperlink({ link: href, children: [new TextRun({ text: titleText, bold: true, color: accent })] })
            : new TextRun({ text: titleText, bold: true });
        const titleRuns = [titleRun];
        if (shape.date) titleRuns.push(new TextRun({ children: [new Tab(), shape.date], color: MUTED, size: 19 }));

        out.push(
            new Paragraph({
                keepNext: true,
                keepLines: true,
                spacing: { before: index ? 160 : 40, after: 20 },
                tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
                children: titleRuns,
            }),
        );
        if (shape.primary && shape.secondary) {
            out.push(new Paragraph({ keepNext: Boolean(shape.body), spacing: { after: 60 }, children: [new TextRun({ text: shape.secondary, italics: true, color: MUTED })] }));
        }
        if (shape.body) out.push(...descriptionParagraphs(shape.body));
        if (shape.contact) {
            const runs = [];
            const email = (shape.contact.email ?? '').trim();
            const phone = (shape.contact.phone ?? '').trim();
            if (email) runs.push(link(email, `mailto:${email}`, accent));
            if (email && phone) runs.push(new TextRun({ text: '   ·   ', color: MUTED }));
            if (phone) runs.push(new TextRun({ text: phone }));
            if (runs.length) out.push(new Paragraph({ spacing: { after: 60 }, children: runs }));
        }
    });
    return out;
}

function sectionParagraphs(ctx, section, accent) {
    const out = [heading(section.title, accent)];
    if (section.kind === 'text') {
        out.push(...descriptionParagraphs(section.text));
    } else if (section.key === 'skills') {
        for (const [group, items] of groupSkills(section.items)) {
            const names = items.map((item) => skillLabel(item)).join(', ');
            out.push(
                new Paragraph({
                    spacing: { after: 60 },
                    children: group ? [new TextRun({ text: `${group}: `, bold: true }), new TextRun(names)] : [new TextRun(names)],
                }),
            );
        }
    } else if (section.key === 'languages') {
        out.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun(section.items.map((item) => languageLabel(item)).join(', '))] }));
    } else {
        out.push(...entryParagraphs(ctx, section, accent));
    }
    return out;
}

function documentStyles(font) {
    return {
        default: {
            document: { run: { font, size: 21, color: INK }, paragraph: { spacing: { line: 276 } } },
        },
    };
}

function numbering() {
    return {
        config: [
            {
                reference: BULLETS,
                levels: [
                    {
                        level: 0,
                        format: LevelFormat.BULLET,
                        text: '•',
                        alignment: AlignmentType.LEFT,
                        style: { paragraph: { indent: { left: 360, hanging: 220 } } },
                    },
                ],
            },
        ],
    };
}

function pageProperties() {
    return { page: { size: A4, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } };
}

function headerBlock(ctx, accent) {
    const identity = [
        new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: ctx.hasName ? ctx.name : ctx.L('placeholderName'), bold: true, size: 48 })] }),
    ];
    if (ctx.title) identity.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: ctx.title, color: accent, size: 24 })] }));
    if (ctx.contacts.length) identity.push(new Paragraph({ spacing: { after: 60 }, children: contactRuns(ctx, accent) }));

    if (!ctx.photo) {
        return identity;
    }

    const photoWidth = 1600; // twips of the photo column
    return [
        new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: [CONTENT_WIDTH - photoWidth, photoWidth],
            borders: TableBorders.NONE,
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ width: { size: CONTENT_WIDTH - photoWidth, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER, children: identity }),
                        new TableCell({
                            width: { size: photoWidth, type: WidthType.DXA },
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [new ImageRun({ type: 'jpg', data: bytesFromDataUrl(ctx.photo.square), transformation: { width: 92, height: 92 } })],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
    ];
}

/** Builds the CV as a docx Document. */
export function buildCvDocx(project, photos = null) {
    const ctx = prepare(project, photos);
    const accent = hex(ctx.accent);
    const font = project.design.templateId === 'executive' ? 'Georgia' : 'Calibri';

    const children = [...headerBlock(ctx, accent)];
    for (const section of ctx.sections) {
        children.push(...sectionParagraphs(ctx, section, accent));
    }

    return new Document({
        creator: 'Krijo CV',
        title: ctx.hasName ? `CV – ${ctx.name}` : 'CV',
        description: 'Curriculum Vitae',
        styles: documentStyles(font),
        numbering: numbering(),
        sections: [{ properties: pageProperties(), children }],
    });
}

/** Builds the cover letter as a docx Document. */
export function buildLetterDocx(project) {
    const ctx = prepare(project, null);
    const accent = hex(ctx.accent);
    const letter = project.coverLetter ?? {};
    const t = (value) => (value ?? '').toString().trim();
    const font = project.design.templateId === 'executive' ? 'Georgia' : 'Calibri';

    const children = [
        new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: ctx.hasName ? ctx.name : ctx.L('placeholderName'), bold: true, size: 40 })] }),
    ];
    if (ctx.title) children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: ctx.title, color: MUTED, size: 22 })] }));
    if (ctx.contacts.length) children.push(new Paragraph({ children: contactRuns(ctx, accent) }));
    children.push(new Paragraph({ spacing: { after: 360 }, border: { bottom: { color: accent, space: 6, style: BorderStyle.SINGLE, size: 12 } }, children: [] }));

    const dateLine = join([t(letter.city) || t(ctx.personal.city), t(letter.date)], ', ');
    if (dateLine) children.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 280 }, children: [new TextRun({ text: dateLine, color: MUTED })] }));

    const recipient = [t(letter.recipientName), t(letter.recipientTitle), t(letter.company), t(letter.address)].filter(Boolean);
    recipient.forEach((line, index) => {
        children.push(new Paragraph({ spacing: { after: index === recipient.length - 1 ? 280 : 0 }, children: [new TextRun({ text: line, bold: index === 0 })] }));
    });

    if (t(letter.subject)) {
        children.push(
            new Paragraph({
                spacing: { after: 240 },
                children: [
                    ...(ctx.L('subject') ? [new TextRun({ text: `${ctx.L('subject')}: `, bold: true, color: accent })] : []),
                    new TextRun({ text: t(letter.subject), bold: true }),
                ],
            }),
        );
    }
    if (t(letter.salutation)) children.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun(t(letter.salutation))] }));

    if (!isCoverLetterEmpty(letter)) {
        for (const paragraph of descriptionParagraphs(letter.body)) children.push(paragraph);
    }

    children.push(new Paragraph({ spacing: { before: 240, after: 480 }, keepNext: true, children: [new TextRun(t(letter.closing) || ctx.L('sincerely'))] }));
    children.push(new Paragraph({ children: [new TextRun({ text: ctx.hasName ? ctx.name : ctx.L('placeholderName'), bold: true })] }));

    return new Document({
        creator: 'Krijo CV',
        title: ctx.hasName ? `${ctx.L('coverLetter')} – ${ctx.name}` : ctx.L('coverLetter'),
        styles: documentStyles(font),
        numbering: numbering(),
        sections: [{ properties: pageProperties(), children }],
    });
}

export function docxToBlob(document) {
    return Packer.toBlob(document);
}

export function docxToBuffer(document) {
    return Packer.toBuffer(document);
}

