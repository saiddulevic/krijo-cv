/**
 * Executive: single column, serif typography, generous spacing and the
 * professional experience placed first and set in a larger size.
 */
import { FONT_SERIF, INK, MUTED, baseDocument, contactInline, contentWidth, keepWithNext, nameText, photoSquare, rule, sectionBody } from './common.js';

export default function executive(ctx) {
    const margins = [58, 56, 58, 60];
    const doc = baseDocument(ctx, { font: FONT_SERIF, fontSize: 10.5, lineHeight: 1.35, margins });
    const width = contentWidth(margins);

    const header = [
        nameText(ctx, { fontSize: 30, bold: true, alignment: 'center', lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 12, italics: true, color: MUTED, alignment: 'center', margin: [0, 6, 0, 0] }] : []),
    ];
    const contacts = contactInline(ctx, { color: MUTED, fontSize: 9.5, separator: '   |   ' });
    if (contacts) header.push({ ...contacts, alignment: 'center', margin: [0, 10, 0, 0] });

    const photo = photoSquare(ctx, 78);
    if (photo) {
        doc.content.push({ ...photo, alignment: 'center', margin: [0, 0, 0, 12] });
    }
    doc.content.push(...header);
    doc.content.push(rule(width, ctx.accent, 1.4, [0, 16, 0, 0]));
    doc.content.push(rule(width, ctx.accent, 0.5, [0, 2, 0, 4]));

    const heading = (text) =>
        keepWithNext(
            [
                { text: text.toUpperCase(), bold: true, fontSize: 11, characterSpacing: 1.6, color: INK, margin: [0, 0, 0, 3] },
                rule(width, MUTED, 0.5, [0, 0, 0, 10]),
            ],
            1,
            { margin: [0, 20, 0, 0] },
            width,
        );

    for (const section of ctx.ordered(['summary', 'experience'])) {
        doc.content.push(heading(section.title));
        const emphasised = section.key === 'experience';
        doc.content.push(
            ...sectionBody(ctx, section, {
                columnWidth: width,
                layout: 'dateRight',
                titleStyle: { bold: true, fontSize: emphasised ? 12 : 11 },
                subStyle: { italics: true, color: MUTED, fontSize: 10 },
                dateStyle: { color: MUTED, fontSize: 9.5 },
                bodyStyle: { fontSize: 10 },
                gap: emphasised ? 14 : 10,
            }),
        );
    }

    return doc;
}
