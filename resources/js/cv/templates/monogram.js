/**
 * Monogram: a centred medallion (round photo with an accent ring, or the
 * initials on an accent disc), centred name and contacts, then the content in
 * two equal columns separated by a thin divider drawn on every page.
 */
import { LINE, MUTED, baseDocument, contactInline, contentWidth, initials, keepWithNext, languagesList, nameText, readableOn, sectionBody, shade, skillChips, tint } from './common.js';

const LEFT_KEYS = ['summary', 'experience', 'volunteer'];
const HEADER_HEIGHT = 190; // fixed header block so the divider start is known
const RULE_BLOCK = 20; // rule margins + line

export default function monogram(ctx) {
    const margins = [44, 46, 44, 50];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);
    const gap = 28;
    const columnsTop = margins[1] + HEADER_HEIGHT + RULE_BLOCK;

    doc.background = (page, size) => {
        const y1 = page === 1 ? columnsTop : margins[1];
        const x = margins[0] + width / 2;
        return [{ canvas: [{ type: 'line', x1: x, y1, x2: x, y2: size.height - margins[3], lineWidth: 0.6, lineColor: LINE }] }];
    };

    const header = [];
    if (ctx.photo) {
        const ring = 92;
        const img = 82;
        header.push({ canvas: [{ type: 'ellipse', x: width / 2, y: ring / 2, r1: ring / 2, r2: ring / 2, color: ctx.accent }] });
        header.push({ image: ctx.photo.round, width: img, height: img, relativePosition: { x: (width - img) / 2, y: -ring + (ring - img) / 2 } });
    } else {
        const disc = 84;
        header.push({ canvas: [{ type: 'ellipse', x: width / 2, y: disc / 2, r1: disc / 2, r2: disc / 2, color: ctx.accent }] });
        header.push({ text: initials(ctx), fontSize: 30, bold: true, color: readableOn(ctx.accent), alignment: 'center', relativePosition: { x: 0, y: -disc + 23 } });
    }
    header.push(nameText(ctx, { fontSize: 24, bold: true, alignment: 'center', characterSpacing: 0.4, margin: [0, 12, 0, 0] }));
    if (ctx.title) header.push({ text: ctx.title, fontSize: 11, color: MUTED, alignment: 'center', margin: [0, 3, 0, 0] });
    const contacts = contactInline(ctx, { color: MUTED, fontSize: 8.8, separator: '   ·   ' });
    if (contacts) header.push({ ...contacts, alignment: 'center', margin: [0, 8, 0, 0] });

    doc.content.push({
        table: { widths: [width], heights: [HEADER_HEIGHT], body: [[{ stack: header }]] },
        layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 0,
            paddingRight: () => 0,
            paddingTop: () => 0,
            paddingBottom: () => 0,
        },
    });
    doc.content.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: width, y2: 0, lineWidth: 1.2, lineColor: ctx.accent }],
        margin: [0, 12, 0, RULE_BLOCK - 13],
    });

    const heading = (text) =>
        keepWithNext([{ text: text.toUpperCase(), bold: true, fontSize: 9, color: ctx.accent, characterSpacing: 1, margin: [0, 14, 0, 6] }]);

    const render = (sections) => {
        const nodes = [];
        for (const section of sections) {
            nodes.push(heading(section.title));
            nodes.push(
                ...sectionBody(ctx, section, {
                    layout: 'stacked',
                    titleStyle: { bold: true, fontSize: 10.2 },
                    subStyle: { color: MUTED, fontSize: 9.2 },
                    dateStyle: { color: ctx.accent, bold: true, fontSize: 8.4 },
                    bodyStyle: { fontSize: 9.2 },
                    gap: 8,
                    skills: (items) => [skillChips(items, { background: tint(ctx.accent, 0.86), color: shade(ctx.accent, 0.3), fontSize: 8.6 })],
                    languages: (items) => languagesList(items, { fontSize: 9.2 }),
                }),
            );
        }
        return nodes;
    };

    const left = render(ctx.sections.filter((s) => LEFT_KEYS.includes(s.key) || s.custom));
    const right = render(ctx.sections.filter((s) => !LEFT_KEYS.includes(s.key) && !s.custom));
    const columnWidth = (width - gap) / 2;

    doc.content.push({
        columns: [
            { width: columnWidth, stack: left },
            { width: columnWidth, stack: right },
        ],
        columnGap: gap,
    });

    return doc;
}
