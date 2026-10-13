/**
 * Student: summary, education, projects, internships/experience, volunteer
 * work and skills, in that order, with a fresh accent-coloured header.
 */
import { L, LINE, MUTED, baseDocument, contactInline, contentWidth, keepWithNext, languagesInline, nameText, photoSquare, rule, sectionBody, skillsInline } from './common.js';

const ORDER = ['summary', 'education', 'projects', 'experience', 'volunteer', 'skills', 'languages'];

export default function student(ctx) {
    const margins = [46, 44, 46, 50];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);

    const headerText = [
        nameText(ctx, { fontSize: 24, bold: true, color: ctx.accent, lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 11, color: MUTED, margin: [0, 3, 0, 0] }] : []),
    ];
    const contacts = contactInline(ctx, { color: MUTED, fontSize: 9 });
    if (contacts) headerText.push({ ...contacts, margin: [0, 7, 0, 0] });
    const photo = photoSquare(ctx, 70);
    doc.content.push(
        photo
            ? { columns: [{ width: 'auto', ...photo, margin: [0, 0, 14, 0] }, { width: '*', stack: headerText }] }
            : { stack: headerText },
    );
    doc.content.push(rule(width, LINE, 0.8, [0, 12, 0, 0]));

    const heading = (text) =>
        keepWithNext([{ text: text.toUpperCase(), bold: true, fontSize: 9.5, color: ctx.accent, characterSpacing: 0.9, margin: [0, 14, 0, 6] }], 1, {}, width);

    for (const section of ctx.ordered(ORDER)) {
        const title = section.key === 'experience' ? L('internships') : section.title;
        doc.content.push(heading(title));
        doc.content.push(
            ...sectionBody(ctx, section, {
                columnWidth: width,
                layout: 'dateRight',
                titleStyle: { bold: true, fontSize: 10.5 },
                subStyle: { color: MUTED, fontSize: 9.5 },
                dateStyle: { color: MUTED, fontSize: 8.5 },
                bodyStyle: { fontSize: 9.5 },
                gap: 8,
                skills: (items) => [skillsInline(items, { fontSize: 9.5 })],
                languages: (items) => [languagesInline(items, { fontSize: 9.5 })],
            }),
        );
    }

    return doc;
}
