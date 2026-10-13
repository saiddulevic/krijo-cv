/**
 * Professional: full-width header followed by a 65/35 two-column layout.
 * Main column: summary, experience, education, projects…; side column:
 * skills, languages, certifications, references.
 */
import { LINE, MUTED, baseDocument, contactInline, contentWidth, keepWithNext, languagesList, nameText, photoSquare, rule, sectionBody, skillsList } from './common.js';

const SIDE_KEYS = ['skills', 'languages', 'certifications', 'references'];

export default function professional(ctx) {
    const margins = [44, 44, 44, 48];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);
    const gap = 22;
    const mainWidth = Math.round((width - gap) * 0.65);
    const sideWidth = width - gap - mainWidth;

    const heading = (text, size = 10.5) =>
        keepWithNext(
            [
                { text, bold: true, fontSize: size, color: ctx.accent, margin: [0, 0, 0, 2] },
                rule(size > 10 ? mainWidth : sideWidth, LINE, 0.6, [0, 0, 0, 6]),
            ],
            1,
            { margin: [0, 12, 0, 0] },
            size > 10 ? mainWidth : sideWidth,
        );

    const headerText = [
        nameText(ctx, { fontSize: 25, bold: true, lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 11.5, color: MUTED, margin: [0, 3, 0, 0] }] : []),
    ];
    const contacts = contactInline(ctx, { color: MUTED, fontSize: 9 });
    if (contacts) headerText.push({ ...contacts, margin: [0, 8, 0, 0] });
    const photo = photoSquare(ctx, 72);
    doc.content.push(
        photo
            ? { columns: [{ width: 'auto', ...photo, margin: [0, 0, 14, 0] }, { width: '*', stack: headerText }], columnGap: 0 }
            : { stack: headerText },
    );
    doc.content.push(rule(width, ctx.accent, 2, [0, 12, 0, 2]));

    const main = [];
    for (const section of ctx.sections.filter((s) => !SIDE_KEYS.includes(s.key))) {
        main.push(heading(section.title));
        main.push(
            ...sectionBody(ctx, section, {
                columnWidth: mainWidth,
                layout: 'dateRight',
                titleStyle: { bold: true, fontSize: 10.5 },
                subStyle: { color: MUTED, fontSize: 9.5 },
                dateStyle: { color: MUTED, fontSize: 8.5 },
                bodyStyle: { fontSize: 9.5 },
                gap: 8,
            }),
        );
    }

    const side = [];
    for (const section of ctx.sections.filter((s) => SIDE_KEYS.includes(s.key))) {
        side.push(heading(section.title, 10));
        side.push(
            ...sectionBody(ctx, section, {
                columnWidth: sideWidth,
                layout: 'stacked',
                titleStyle: { bold: true, fontSize: 9.5 },
                subStyle: { color: MUTED, fontSize: 9 },
                dateStyle: { color: MUTED, fontSize: 8.5 },
                bodyStyle: { fontSize: 9 },
                gap: 6,
                skills: (items) => skillsList(items, { fontSize: 9 }),
                languages: (items) => languagesList(items, { fontSize: 9 }),
            }),
        );
    }

    doc.content.push({
        columns: [
            { width: mainWidth, stack: main },
            { width: sideWidth, stack: side },
        ],
        columnGap: gap,
    });

    return doc;
}
