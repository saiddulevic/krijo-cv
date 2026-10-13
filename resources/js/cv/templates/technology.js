/**
 * Technology: prominent projects with portfolio links, grouped technical
 * skills and clearly separated experience entries.
 */
import { INK, L, LINE, MUTED, baseDocument, contentWidth, keepWithNext, languagesInline, linkNode, nameText, photoSquare, rule, sectionBody, skillsGrouped, textBlock } from './common.js';

const ORDER = ['summary', 'skills', 'projects', 'experience', 'education'];

export default function technology(ctx) {
    const margins = [44, 44, 44, 48];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const width = contentWidth(margins);

    const headerText = [
        nameText(ctx, { fontSize: 23, bold: true, lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 11, color: MUTED, margin: [0, 3, 0, 0] }] : []),
    ];
    if (ctx.contacts.length) {
        const parts = [];
        ctx.contacts.forEach((c, i) => {
            if (i) parts.push({ text: '   ', color: MUTED });
            const isLink = c.kind === 'website' || c.kind === 'linkedin';
            parts.push({ text: c.text, link: c.link, color: isLink ? ctx.accent : MUTED, bold: isLink });
        });
        headerText.push({ text: parts, fontSize: 9, margin: [0, 8, 0, 0] });
    }
    const photo = photoSquare(ctx, 66);
    doc.content.push(
        photo
            ? { columns: [{ width: '*', stack: headerText }, { width: 'auto', ...photo, margin: [14, 0, 0, 0] }] }
            : { stack: headerText },
    );
    doc.content.push(rule(width, INK, 1, [0, 12, 0, 0]));

    const heading = (text) =>
        keepWithNext(
            [
                {
                    columns: [
                        { width: 8, canvas: [{ type: 'rect', x: 0, y: 3, w: 6, h: 6, color: ctx.accent }] },
                        { width: '*', text: text.toUpperCase(), bold: true, fontSize: 9.5, characterSpacing: 0.8, color: INK },
                    ],
                    columnGap: 4,
                },
            ],
            1,
            { margin: [0, 14, 0, 6] },
            width,
        );

    const projectEntries = (section) =>
        section.items.map((p, index) => {
            const titleParts = [{ text: p.name.trim(), bold: true, fontSize: 11 }];
            const link = linkNode(p.url, { color: ctx.accent, fontSize: 9 });
            if (link) titleParts.push({ text: '   ' }, link);
            const meta = [p.role, p.date].map((v) => (v ?? '').trim()).filter(Boolean).join(' · ');
            const stack = [{ text: titleParts }];
            if (meta) stack.push({ text: meta, color: MUTED, fontSize: 9.5 });
            if ((p.technologies ?? '').trim()) {
                stack.push({ text: [{ text: `${L('technologies')}: `, bold: true }, { text: p.technologies.trim() }], fontSize: 9, color: MUTED, margin: [0, 1, 0, 0] });
            }
            return {
                stack: [(p.description ?? '').trim() ? keepWithNext(stack, 2, {}, width) : { stack, unbreakable: true }, ...textBlock(p.description, { fontSize: 9.5 })],
                margin: [0, index ? 9 : 0, 0, 0],
            };
        });

    for (const section of ctx.ordered(ORDER)) {
        doc.content.push(heading(section.title));
        if (section.key === 'projects') {
            doc.content.push(...projectEntries(section));
            continue;
        }
        doc.content.push(
            ...sectionBody(ctx, section, {
                layout: 'dateRight',
                titleStyle: { bold: true, fontSize: 10.5 },
                subStyle: { color: MUTED, fontSize: 9.5 },
                dateStyle: { color: MUTED, fontSize: 8.5 },
                bodyStyle: { fontSize: 9.5 },
                gap: 9,
                skills: (items) => skillsGrouped(items, { labelStyle: { bold: true }, style: { fontSize: 9.5 } }),
                languages: (items) => [languagesInline(items, { fontSize: 9.5 })],
            }),
        );
        if (section.key === 'experience') {
            doc.content.push(rule(width, LINE, 0.5, [0, 10, 0, 0]));
        }
    }

    return doc;
}
