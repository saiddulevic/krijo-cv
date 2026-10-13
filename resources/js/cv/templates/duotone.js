/**
 * Dyngjyrësh (duotone): a split header (accent block with the name, tinted
 * block with contacts and photo), short accent bars under the headings and
 * level bars for skills and languages in a two-column grid.
 */
import { INK, MUTED, baseDocument, contactIconRows, contentWidth, keepWithNext, languageBars, nameText, photoRound, readableOn, sectionBody, tint } from './common.js';

export default function duotone(ctx) {
    const margins = [44, 44, 44, 48];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);
    const onAccent = readableOn(ctx.accent);
    const leftWidth = Math.round(width * 0.42);

    const photo = photoRound(ctx, 64);
    doc.content.push({
        table: {
            widths: [leftWidth, width - leftWidth],
            body: [
                [
                    {
                        fillColor: ctx.accent,
                        stack: [
                            nameText(ctx, { fontSize: 22, bold: true, color: onAccent, lineHeight: 1.1 }),
                            ...(ctx.title ? [{ text: ctx.title, fontSize: 10.5, color: onAccent, opacity: 0.9, margin: [0, 5, 0, 0] }] : []),
                        ],
                        margin: [16, 20, 14, 20],
                    },
                    {
                        fillColor: tint(ctx.accent, 0.9),
                        columns: [
                            { width: '*', stack: contactIconRows(ctx, { color: INK, iconColor: ctx.accent, fontSize: 8.8, gap: 3 }), margin: [0, 2, 0, 0] },
                            ...(photo ? [{ width: 'auto', ...photo, margin: [10, 0, 0, 0] }] : []),
                        ],
                        margin: [16, 16, 14, 16],
                    },
                ],
            ],
        },
        layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 0,
            paddingRight: () => 0,
            paddingTop: () => 0,
            paddingBottom: () => 0,
        },
    });

    const heading = (text) =>
        keepWithNext([
            { text, bold: true, fontSize: 11.5, color: INK, margin: [0, 16, 0, 3] },
            { canvas: [{ type: 'rect', x: 0, y: 0, w: 30, h: 3, color: ctx.accent }], margin: [0, 0, 0, 8] },
        ]);

    const barsGrid = (nodesFor) => {
        const gap = 20;
        const colWidth = (width - gap) / 2;
        return {
            columns: [
                { width: colWidth, stack: nodesFor(0, colWidth) },
                { width: colWidth, stack: nodesFor(1, colWidth) },
            ],
            columnGap: gap,
        };
    };

    for (const section of ctx.sections) {
        doc.content.push(heading(section.title));
        doc.content.push(
            ...sectionBody(ctx, section, {
                layout: 'dateRight',
                titleStyle: { bold: true, fontSize: 10.5 },
                subStyle: { color: MUTED, fontSize: 9.5 },
                dateStyle: { color: ctx.accent, bold: true, fontSize: 8.5 },
                bodyStyle: { fontSize: 9.5 },
                gap: 8,
                skills: (items) => [
                    barsGrid((column, colWidth) =>
                        items
                            .filter((_, i) => i % 2 === column)
                            .flatMap((item) => [
                                { text: item.name.trim(), fontSize: 9 },
                                { canvas: [{ type: 'rect', x: 0, y: 0, w: colWidth, h: 4, r: 2, color: tint(ctx.accent, 0.85) }, { type: 'rect', x: 0, y: 0, w: Math.max(4, colWidth * ({ basic: 0.3, intermediate: 0.55, advanced: 0.8, expert: 1 }[item.level] ?? 1)), h: 4, r: 2, color: ctx.accent }], margin: [0, 2, 0, 5] },
                            ]),
                    ),
                ],
                languages: (items) => [barsGrid((column, colWidth) => languageBars(items.filter((_, i) => i % 2 === column), colWidth, { accent: ctx.accent }))],
            }),
        );
    }

    return doc;
}
