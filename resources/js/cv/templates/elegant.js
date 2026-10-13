/**
 * Elegant: a full-height panel in the accent colour on the left (round photo
 * with a white ring, contacts with icons, skills, languages, certifications)
 * and a serif name with short accent bars under the headings on the right.
 */
import { FONT_SERIF, INK, L, MUTED, baseDocument, contactIconRows, contentWidth, keepWithNext, languagesList, nameText, readableOn, rule, sectionBody, skillsList } from './common.js';

const SIDEBAR = 168;
const GAP = 26;
const SIDE_KEYS = ['skills', 'languages', 'certifications'];

export default function elegant(ctx) {
    const margins = [40, 44, 40, 48];
    const doc = baseDocument(ctx, { fontSize: 10, margins });
    const panelWidth = margins[0] + SIDEBAR + GAP / 2;
    const onPanel = readableOn(ctx.accent);

    doc.background = (page, size) => [{ canvas: [{ type: 'rect', x: 0, y: 0, w: panelWidth, h: size.height, color: ctx.accent }] }];

    const side = [];
    if (ctx.photo) {
        const ring = 100;
        const img = 90;
        side.push({ canvas: [{ type: 'ellipse', x: SIDEBAR / 2, y: ring / 2, r1: ring / 2, r2: ring / 2, color: '#FFFFFF' }], margin: [0, 0, 0, 12] });
        side.push({
            image: ctx.photo.round,
            width: img,
            height: img,
            absolutePosition: { x: margins[0] + (SIDEBAR - img) / 2, y: margins[1] + (ring - img) / 2 },
        });
    }

    const sideHeading = (text) =>
        keepWithNext([
            { text: text.toUpperCase(), bold: true, fontSize: 8.5, color: onPanel, characterSpacing: 0.9, margin: [0, 10, 0, 2] },
            rule(SIDEBAR, onPanel, 0.5, [0, 0, 0, 6]),
        ]);

    if (ctx.contacts.length) {
        side.push(sideHeading(L('contact')));
        side.push(...contactIconRows(ctx, { color: onPanel, iconColor: onPanel, fontSize: 8.5, gap: 4 }));
    }
    const skills = ctx.section('skills');
    if (skills) {
        side.push(sideHeading(skills.title));
        side.push(...skillsList(skills.items, { fontSize: 8.5, color: onPanel }));
    }
    const languages = ctx.section('languages');
    if (languages) {
        side.push(sideHeading(languages.title));
        side.push(...languagesList(languages.items, { fontSize: 8.5, color: onPanel }));
    }
    const certifications = ctx.section('certifications');
    if (certifications) {
        side.push(sideHeading(certifications.title));
        for (const item of certifications.items) {
            side.push({ text: item.name, fontSize: 8.5, bold: true, color: onPanel, margin: [0, 0, 0, 1] });
            const line = [item.issuer, item.date].filter((v) => (v ?? '').trim()).join(', ');
            if (line) side.push({ text: line, fontSize: 8, color: onPanel, opacity: 0.85, margin: [0, 0, 0, 4] });
        }
    }

    const main = [
        nameText(ctx, { font: FONT_SERIF, fontSize: 27, bold: true, lineHeight: 1.1 }),
        ...(ctx.title ? [{ text: ctx.title.toUpperCase(), fontSize: 9.5, color: ctx.accent, characterSpacing: 1.2, margin: [0, 6, 0, 0] }] : []),
    ];

    const mainHeading = (text) =>
        keepWithNext([
            { text: text.toUpperCase(), bold: true, fontSize: 9.5, color: INK, characterSpacing: 1, margin: [0, 16, 0, 3] },
            { canvas: [{ type: 'rect', x: 0, y: 0, w: 26, h: 2.2, color: ctx.accent }], margin: [0, 0, 0, 7] },
        ]);

    for (const section of ctx.without(SIDE_KEYS)) {
        main.push(mainHeading(section.title));
        main.push(
            ...sectionBody(ctx, section, {
                layout: 'dateRight',
                titleStyle: { bold: true, fontSize: 10.5 },
                subStyle: { color: MUTED, fontSize: 9.5 },
                dateStyle: { color: ctx.accent, bold: true, fontSize: 8.5 },
                bodyStyle: { fontSize: 9.5 },
                gap: 8,
            }),
        );
    }

    doc.content.push({
        columns: [
            { width: SIDEBAR, stack: side },
            { width: contentWidth(margins) - SIDEBAR - GAP, stack: main },
        ],
        columnGap: GAP,
    });

    doc._qrLeft = SIDEBAR + GAP;
    return doc;
}
