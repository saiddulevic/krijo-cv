/**
 * Creative: circular photo in a coloured header band, distinct content blocks
 * on a light background and skills arranged in a compact grid.
 */
import { MUTED, SOFT, baseDocument, contactInline, contentWidth, keepWithNext, languagesInline, nameText, photoRound, sectionBody, skillsGrid } from './common.js';

export default function creative(ctx) {
    const margins = [40, 40, 40, 46];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);

    const headerText = [
        nameText(ctx, { fontSize: 24, bold: true, color: '#FFFFFF', lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 11, color: '#FFFFFF', opacity: 0.92, margin: [0, 3, 0, 0] }] : []),
    ];
    const contacts = contactInline(ctx, { color: '#FFFFFF', fontSize: 8.5 });
    if (contacts) headerText.push({ ...contacts, margin: [0, 8, 0, 0] });

    const photo = photoRound(ctx, 84);
    doc.content.push({
        table: {
            widths: ['*'],
            body: [
                [
                    {
                        fillColor: ctx.accent,
                        margin: [18, 16, 18, 16],
                        columns: photo
                            ? [{ width: 'auto', ...photo, margin: [0, 0, 16, 0] }, { width: '*', stack: headerText, margin: [0, 6, 0, 0] }]
                            : [{ width: '*', stack: headerText }],
                    },
                ],
            ],
        },
        layout: 'noBorders',
    });

    const block = (section) => {
        const heading = keepWithNext(
            [{ text: section.title.toUpperCase(), bold: true, fontSize: 9.5, color: ctx.accent, characterSpacing: 0.8, margin: [0, 0, 0, 6] }],
            1,
            {},
            width - 32,
        );
        const body = sectionBody(ctx, section, {
            columnWidth: width - 32,
            layout: 'stacked',
            titleStyle: { bold: true, fontSize: 10.5 },
            subStyle: { color: MUTED, fontSize: 9.5 },
            dateStyle: { color: ctx.accent, fontSize: 8.5, bold: true },
            bodyStyle: { fontSize: 9.5 },
            gap: 7,
            skills: (items) => [skillsGrid(items, 3, { fontSize: 9 })],
            languages: (items) => [languagesInline(items, { fontSize: 9.5 })],
        });
        return {
            table: {
                widths: [width - 32],
                body: [[{ stack: [heading, ...body], fillColor: SOFT, margin: [16, 12, 16, 12] }]],
            },
            layout: 'noBorders',
            margin: [0, 10, 0, 0],
        };
    };

    for (const section of ctx.sections) {
        doc.content.push(block(section));
    }

    return doc;
}
