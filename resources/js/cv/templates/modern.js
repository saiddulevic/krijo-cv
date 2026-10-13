/**
 * Modern: a light sidebar on the left with photo, contact details, skills and
 * languages; the main content on the right. The sidebar background is drawn
 * on every page.
 */
import { INK, L, MUTED, PAGE, SOFT, baseDocument, contactStack, keepWithNext, languagesList, nameText, photoSquare, sectionBody, skillsList } from './common.js';

const SIDEBAR_WIDTH = 150;
const GAP = 24;

export default function modern(ctx) {
    const margins = [40, 44, 40, 48];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    doc.background = (page, size) => [
        { canvas: [{ type: 'rect', x: 0, y: 0, w: margins[0] + SIDEBAR_WIDTH + GAP / 2, h: size.height, color: SOFT }] },
    ];

    const mainWidth = PAGE.width - margins[0] - margins[2] - SIDEBAR_WIDTH - GAP;
    const sideHeading = (text) =>
        keepWithNext([{ text: text.toUpperCase(), bold: true, fontSize: 8.5, color: ctx.accent, characterSpacing: 0.8, margin: [0, 12, 0, 5] }], 1, {}, SIDEBAR_WIDTH);
    const mainHeading = (text) =>
        keepWithNext([{ text: text.toUpperCase(), bold: true, fontSize: 10, color: ctx.accent, characterSpacing: 0.8, margin: [0, 14, 0, 6] }], 1, {}, mainWidth);

    const sidebar = [];
    const photo = photoSquare(ctx, 118);
    if (photo) sidebar.push({ ...photo, margin: [0, 0, 0, 6] });
    if (ctx.contacts.length) {
        sidebar.push(sideHeading(L('contact')));
        sidebar.push(...contactStack(ctx, { color: INK, fontSize: 8.5 }));
    }
    const skills = ctx.section('skills');
    if (skills) {
        sidebar.push(sideHeading(skills.title));
        sidebar.push(...skillsList(skills.items, { fontSize: 8.5 }));
    }
    const languages = ctx.section('languages');
    if (languages) {
        sidebar.push(sideHeading(languages.title));
        sidebar.push(...languagesList(languages.items, { fontSize: 8.5 }));
    }
    const certifications = ctx.section('certifications');
    if (certifications) {
        sidebar.push(sideHeading(certifications.title));
        for (const item of certifications.items) {
            sidebar.push({ text: item.name, fontSize: 8.5, bold: true, margin: [0, 0, 0, 1] });
            const line = [item.issuer, item.date].filter((v) => (v ?? '').trim()).join(', ');
            if (line) sidebar.push({ text: line, fontSize: 8, color: MUTED, margin: [0, 0, 0, 4] });
        }
    }

    const main = [
        nameText(ctx, { fontSize: 24, bold: true, color: ctx.accent, lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title, fontSize: 11, color: MUTED, margin: [0, 3, 0, 0] }] : []),
    ];

    for (const section of ctx.without(['skills', 'languages', 'certifications'])) {
        main.push(mainHeading(section.title));
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

    doc.content.push({
        columns: [
            { width: SIDEBAR_WIDTH, stack: sidebar },
            { width: mainWidth, stack: main },
        ],
        columnGap: GAP,
    });

    doc._qrLeft = SIDEBAR_WIDTH + GAP;
    return doc;
}
