/**
 * Kronologjik (timeline): experience, education and volunteer work sit on a
 * vertical timeline with accent dots; contacts carry small icons; skills are
 * shown as tinted chips.
 */
import { INK, MUTED, baseDocument, contactIconRows, contentWidth, keepWithNext, languagesInline, nameText, photoRound, rule, sectionBody, shade, skillChips, timelineEntries, tint } from './common.js';

const TIMELINE_KEYS = ['experience', 'education', 'volunteer'];

export default function timeline(ctx) {
    const margins = [46, 44, 46, 48];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);

    const headerText = [
        nameText(ctx, { fontSize: 25, bold: true, lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 11, color: MUTED, margin: [0, 3, 0, 0] }] : []),
    ];
    const rows = contactIconRows(ctx, { color: INK, iconColor: ctx.accent, fontSize: 9, gap: 3 });
    if (rows.length) {
        const half = Math.ceil(rows.length / 2);
        headerText.push({
            columns: [
                { width: '*', stack: rows.slice(0, half) },
                { width: '*', stack: rows.slice(half) },
            ],
            columnGap: 12,
            margin: [0, 9, 0, 0],
        });
    }
    const photo = photoRound(ctx, 72);
    doc.content.push(
        photo
            ? { columns: [{ width: 'auto', ...photo, margin: [0, 0, 16, 0] }, { width: '*', stack: headerText }], columnGap: 0 }
            : { stack: headerText },
    );
    doc.content.push(rule(width, ctx.accent, 1.5, [0, 12, 0, 0]));

    const heading = (text) =>
        keepWithNext([
            {
                columns: [
                    { width: 10, canvas: [{ type: 'ellipse', x: 5, y: 5.5, r1: 4, r2: 4, color: ctx.accent }] },
                    { width: '*', text: text.toUpperCase(), bold: true, fontSize: 9.5, color: INK, characterSpacing: 0.9 },
                ],
                columnGap: 6,
                margin: [0, 14, 0, 6],
            },
        ]);

    for (const section of ctx.sections) {
        doc.content.push(heading(section.title));
        if (TIMELINE_KEYS.includes(section.key) && section.kind === 'entries') {
            doc.content.push(timelineEntries(ctx, section, { accent: ctx.accent }));
            continue;
        }
        doc.content.push(
            ...sectionBody(ctx, section, {
                layout: 'dateRight',
                titleStyle: { bold: true, fontSize: 10.5 },
                subStyle: { color: MUTED, fontSize: 9.5 },
                dateStyle: { color: ctx.accent, bold: true, fontSize: 8.5 },
                bodyStyle: { fontSize: 9.5 },
                gap: 8,
                skills: (items) => [skillChips(items, { background: tint(ctx.accent, 0.86), color: shade(ctx.accent, 0.3), fontSize: 8.8 })],
                languages: (items) => [languagesInline(items, { fontSize: 9.5 })],
            }),
        );
    }

    return doc;
}
