/**
 * Academic: education first, then research projects, publications and
 * professional experience. Dates sit in a left column; publications are
 * numbered.
 */
import { LINE, MUTED, baseDocument, contactInline, contentWidth, keepWithNext, linkNode, nameText, photoSquare, rule, sectionBody, textBlock } from './common.js';

export default function academic(ctx) {
    const margins = [48, 46, 48, 52];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);

    const headerText = [
        nameText(ctx, { fontSize: 22, bold: true, lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 11, color: MUTED, margin: [0, 3, 0, 0] }] : []),
    ];
    const contacts = contactInline(ctx, { color: MUTED, fontSize: 9 });
    if (contacts) headerText.push({ ...contacts, margin: [0, 7, 0, 0] });
    const photo = photoSquare(ctx, 64);
    doc.content.push(
        photo
            ? { columns: [{ width: '*', stack: headerText }, { width: 'auto', ...photo, margin: [14, 0, 0, 0] }] }
            : { stack: headerText },
    );
    doc.content.push(rule(width, ctx.accent, 1.2, [0, 12, 0, 0]));

    const heading = (text) =>
        keepWithNext(
            [
                { text, bold: true, fontSize: 11, color: ctx.accent, margin: [0, 0, 0, 2] },
                rule(width, LINE, 0.6, [0, 0, 0, 6]),
            ],
            1,
            { margin: [0, 14, 0, 0] },
            width,
        );

    const publicationsList = (section) => {
        const items = section.items.map((p) => {
            const parts = [{ text: p.title.trim(), bold: true }];
            const meta = [p.publisher, p.date].map((v) => (v ?? '').trim()).filter(Boolean).join(', ');
            if (meta) parts.push({ text: `. ${meta}`, color: MUTED });
            const link = linkNode(p.url, { color: ctx.accent });
            if (link) parts.push({ text: '. ' }, link);
            const stack = [{ text: parts, fontSize: 9.5 }];
            if ((p.description ?? '').trim()) stack.push(...textBlock(p.description, { fontSize: 9, color: MUTED }));
            return { stack, margin: [0, 0, 0, 4] };
        });
        return [{ ol: items, fontSize: 9.5 }];
    };

    for (const section of ctx.ordered(['summary', 'education', 'projects', 'publications', 'experience'])) {
        doc.content.push(heading(section.title));
        if (section.key === 'publications') {
            doc.content.push(...publicationsList(section));
            continue;
        }
        doc.content.push(
            ...sectionBody(ctx, section, {
                columnWidth: width,
                layout: 'dateLeft',
                dateWidth: 88,
                titleStyle: { bold: true, fontSize: 10.5 },
                subStyle: { color: MUTED, fontSize: 9.5 },
                dateStyle: { color: MUTED, fontSize: 9 },
                bodyStyle: { fontSize: 9.5 },
                gap: 8,
            }),
        );
    }

    return doc;
}
