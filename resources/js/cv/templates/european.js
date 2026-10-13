/**
 * European: a narrow left column carries the section labels and the dates,
 * the wide right column carries the content. (An original layout; it does
 * not use Europass branding and is not an official Europass template.)
 */
import { L, LINE, MUTED, baseDocument, contactStack, contentWidth, keepWithNext, languagesList, nameText, photoSquare, rule, sectionBody, skillsList } from './common.js';

const LEFT = 118;
const GAP = 16;

export default function european(ctx) {
    const margins = [42, 44, 42, 48];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);
    const right = width - LEFT - GAP;

    const row = (left, rightContent, margin = [0, 0, 0, 0]) => ({
        columns: [
            { width: LEFT, stack: Array.isArray(left) ? left : [left] },
            { width: right, stack: Array.isArray(rightContent) ? rightContent : [rightContent] },
        ],
        columnGap: GAP,
        margin,
    });
    const label = (text) => ({ text: text.toUpperCase(), bold: true, fontSize: 8.5, color: ctx.accent, characterSpacing: 0.6 });

    // Header: name and title on the right, photo on the left
    const photo = photoSquare(ctx, 78);
    doc.content.push(
        row(photo ? [photo] : [{ text: '' }], [
            nameText(ctx, { fontSize: 22, bold: true, lineHeight: 1.1 }),
            ...(ctx.title ? [{ text: ctx.title, fontSize: 11, color: MUTED, margin: [0, 3, 0, 0] }] : []),
        ]),
    );

    if (ctx.contacts.length) {
        doc.content.push(rule(width, LINE, 0.6, [0, 10, 0, 8]));
        doc.content.push(row(label(L('personal')), contactStack(ctx, { fontSize: 9.5, labels: true })));
    }

    for (const section of ctx.sections) {
        const divider = rule(width, ctx.accent, 0.9, [0, 14, 0, 6]);
        if (section.kind === 'text' || section.key === 'skills' || section.key === 'languages') {
            doc.content.push(keepWithNext([divider]));
            doc.content.push(
                row(
                    label(section.title),
                    sectionBody(ctx, section, {
                        bodyStyle: { fontSize: 9.5 },
                        skills: (items) => skillsList(items, { fontSize: 9.5 }),
                        languages: (items) => languagesList(items, { fontSize: 9.5 }),
                    }),
                ),
            );
            continue;
        }
        const entries = sectionBody(ctx, section, {
            layout: 'dateLeft',
            dateWidth: LEFT,
            titleStyle: { bold: true, fontSize: 10.5 },
            subStyle: { color: MUTED, fontSize: 9.5 },
            dateStyle: { color: MUTED, fontSize: 9 },
            bodyStyle: { fontSize: 9.5 },
            gap: 8,
        });
        // dateLeft rows use columnGap 10; align them with the label column
        for (const node of entries) node.columnGap = GAP;
        doc.content.push(keepWithNext([divider, row(label(section.title), [{ text: '' }], [0, 0, 0, 3])]));
        doc.content.push(...entries);
    }

    return doc;
}
