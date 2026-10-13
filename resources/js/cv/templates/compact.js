/**
 * Compact: tight but readable spacing for shorter CVs. Text never goes below
 * 8.8 pt and long content simply continues on the next page.
 */
import { INK, LINE, MUTED, baseDocument, contactInline, contentWidth, keepWithNext, languagesInline, nameText, photoSquare, rule, sectionBody, skillsInline } from './common.js';

export default function compact(ctx) {
    const margins = [36, 34, 36, 40];
    const doc = baseDocument(ctx, { fontSize: 9.2, lineHeight: 1.18, margins });
    const width = contentWidth(margins);

    const headerText = [
        nameText(ctx, { fontSize: 19, bold: true, lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 10, color: MUTED, margin: [0, 2, 0, 0] }] : []),
    ];
    const contacts = contactInline(ctx, { color: MUTED, fontSize: 8.6, separator: '  ·  ' });
    if (contacts) headerText.push({ ...contacts, margin: [0, 5, 0, 0] });
    const photo = photoSquare(ctx, 54);
    doc.content.push(
        photo
            ? { columns: [{ width: '*', stack: headerText }, { width: 'auto', ...photo, margin: [10, 0, 0, 0] }] }
            : { stack: headerText },
    );
    doc.content.push(rule(width, INK, 0.9, [0, 8, 0, 0]));

    const heading = (text) =>
        keepWithNext([{ text: text.toUpperCase(), bold: true, fontSize: 8.8, color: ctx.accent, characterSpacing: 0.7, margin: [0, 9, 0, 3] }]);

    for (const section of ctx.sections) {
        doc.content.push(heading(section.title));
        doc.content.push(
            ...sectionBody(ctx, section, {
                layout: 'dateRight',
                titleStyle: { bold: true, fontSize: 9.6 },
                subStyle: { color: MUTED, fontSize: 8.8 },
                dateStyle: { color: MUTED, fontSize: 8.4 },
                bodyStyle: { fontSize: 8.8 },
                gap: 4,
                skills: (items) => [skillsInline(items, { fontSize: 8.8 })],
                languages: (items) => [languagesInline(items, { fontSize: 8.8 })],
            }),
        );
        doc.content.push(rule(width, LINE, 0.4, [0, 6, 0, 0]));
    }

    return doc;
}
