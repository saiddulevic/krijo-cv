/**
 * Guximtar (bold): a full-width dark header band on the first page with the
 * name in white and an accent stripe, label-style section headings, skill
 * chips and language bars in a narrow left column.
 */
import { INK, MUTED, baseDocument, contactIconRows, contentWidth, keepWithNext, languageBars, nameText, photoRound, readableOn, sectionBody, shade, skillChips, tint } from './common.js';

const BAND = 164;
const STRIPE = 6;
const LEFT = 156;
const GAP = 24;
const LEFT_KEYS = ['skills', 'languages', 'certifications', 'references'];

export default function bold(ctx) {
    const margins = [40, 44, 40, 48];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);

    doc.background = (page, size) =>
        page === 1
            ? [{ canvas: [{ type: 'rect', x: 0, y: 0, w: size.width, h: BAND, color: INK }, { type: 'rect', x: 0, y: BAND, w: size.width, h: STRIPE, color: ctx.accent }] }]
            : [];

    const headerText = [
        nameText(ctx, { fontSize: 30, bold: true, color: '#FFFFFF', lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 11.5, color: tint(ctx.accent, 0.45), margin: [0, 4, 0, 0] }] : []),
    ];
    const rows = contactIconRows(ctx, { color: '#FFFFFF', iconColor: tint(ctx.accent, 0.45), fontSize: 8.8, gap: 3 });
    if (rows.length) {
        const half = Math.ceil(rows.length / 2);
        headerText.push({
            columns: [
                { width: '*', stack: rows.slice(0, half) },
                { width: '*', stack: rows.slice(half) },
            ],
            columnGap: 10,
            margin: [0, 10, 0, 0],
        });
    }
    const photo = photoRound(ctx, 86);
    doc.content.push({
        table: {
            widths: ['*', 'auto'],
            heights: [BAND - margins[1] - 8],
            body: [[{ stack: headerText, margin: [0, 4, 0, 0] }, photo ? { ...photo, margin: [16, 0, 0, 0] } : { text: '' }]],
        },
        layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 0,
            paddingRight: () => 0,
            paddingTop: () => 0,
            paddingBottom: () => 0,
        },
        margin: [0, 0, 0, 26],
    });

    const label = (text, fill, color) =>
        keepWithNext([
            {
                table: { widths: ['auto'], body: [[{ text: text.toUpperCase(), color, bold: true, fontSize: 8, characterSpacing: 0.8, fillColor: fill, margin: [6, 3, 6, 3] }]] },
                layout: 'noBorders',
                margin: [0, 12, 0, 7],
            },
        ]);

    const left = [];
    for (const section of ctx.sections.filter((s) => LEFT_KEYS.includes(s.key))) {
        left.push(label(section.title, INK, '#FFFFFF'));
        left.push(
            ...sectionBody(ctx, section, {
                layout: 'stacked',
                titleStyle: { bold: true, fontSize: 9.5 },
                subStyle: { color: MUTED, fontSize: 8.8 },
                dateStyle: { color: ctx.accent, bold: true, fontSize: 8.4 },
                bodyStyle: { fontSize: 8.8 },
                gap: 6,
                skills: (items) => [skillChips(items, { background: tint(ctx.accent, 0.85), color: shade(ctx.accent, 0.3), fontSize: 8.6 })],
                languages: (items) => languageBars(items, LEFT, { accent: ctx.accent, style: { fontSize: 8.8 } }),
            }),
        );
    }

    const right = [];
    for (const section of ctx.sections.filter((s) => !LEFT_KEYS.includes(s.key))) {
        right.push(label(section.title, ctx.accent, readableOn(ctx.accent)));
        right.push(
            ...sectionBody(ctx, section, {
                layout: 'dateRight',
                titleStyle: { bold: true, fontSize: 11 },
                subStyle: { color: MUTED, fontSize: 9.5 },
                dateStyle: { color: ctx.accent, bold: true, fontSize: 8.5 },
                bodyStyle: { fontSize: 9.5 },
                gap: 9,
            }),
        );
    }

    doc.content.push({
        columns: [
            { width: LEFT, stack: left },
            { width: width - LEFT - GAP, stack: right },
        ],
        columnGap: GAP,
    });

    doc._qrLeft = LEFT + GAP;
    return doc;
}
