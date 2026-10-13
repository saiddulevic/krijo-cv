/**
 * Minimal: single column, black and white, large name, simple dividers.
 * Deliberately monochrome, so the accent colour is not used here.
 */
import { INK, LINE, MUTED, baseDocument, contactInline, contentWidth, keepWithNext, nameText, photoSquare, rule, sectionBody } from './common.js';

export default function minimal(ctx) {
    const margins = [52, 50, 52, 56];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);

    const headerText = [
        nameText(ctx, { fontSize: 28, bold: true, lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 11.5, color: MUTED, margin: [0, 4, 0, 0] }] : []),
    ];
    const contacts = contactInline(ctx, { color: MUTED, fontSize: 9 });
    if (contacts) headerText.push({ ...contacts, margin: [0, 8, 0, 0] });

    const photo = photoSquare(ctx, 66);
    doc.content.push(
        photo
            ? { columns: [{ width: '*', stack: headerText }, { width: 'auto', ...photo, margin: [16, 2, 0, 0] }], columnGap: 10 }
            : { stack: headerText },
    );
    doc.content.push(rule(width, INK, 1.2, [0, 14, 0, 2]));

    for (const section of ctx.sections) {
        doc.content.push(
            keepWithNext(
                [
                    { text: section.title.toUpperCase(), bold: true, fontSize: 9.5, characterSpacing: 1, margin: [0, 14, 0, 2] },
                    rule(width, LINE, 0.6, [0, 0, 0, 7]),
                ],
                1,
                {},
                width,
            ),
        );
        doc.content.push(
            ...sectionBody(ctx, section, {
                columnWidth: width,
                layout: 'dateRight',
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
