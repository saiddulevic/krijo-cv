/**
 * Cover letter document. It reuses the CV's name, title, contacts, accent
 * colour and (for the Executive template) serif typography so the letter and
 * the CV look like one application.
 */
import { isCoverLetterEmpty } from '../schema.js';
import { FONT_SANS, FONT_SERIF, INK, MUTED, baseDocument, contactInline, contentWidth, join, prepare, rule, textBlock } from './common.js';

export function buildLetter(project, photos = null) {
    const ctx = prepare(project, photos);
    const letter = project.coverLetter ?? {};
    const t = (v) => (v ?? '').toString().trim();
    const serif = project.design.templateId === 'executive';
    const margins = [60, 56, 60, 64];
    const doc = baseDocument(ctx, { font: serif ? FONT_SERIF : FONT_SANS, fontSize: 10.5, lineHeight: 1.4, margins });
    const width = contentWidth(margins);
    doc.info.title = ctx.hasName ? `${ctx.L('coverLetter')} – ${ctx.name}` : ctx.L('coverLetter');

    // Header: same identity block as the CV
    doc.content.push({ text: ctx.hasName ? ctx.name : ctx.L('placeholderName'), fontSize: 20, bold: true, color: ctx.hasName ? INK : '#9CA3AF', lineHeight: 1.1 });
    if (ctx.title) doc.content.push({ text: ctx.title, fontSize: 10.5, color: MUTED, margin: [0, 3, 0, 0] });
    const contacts = contactInline(ctx, { color: MUTED, fontSize: 8.8, separator: '   ·   ' });
    if (contacts) doc.content.push({ ...contacts, margin: [0, 6, 0, 0] });
    doc.content.push(rule(width, ctx.accent, 1.4, [0, 12, 0, 22]));

    // Date line (city of the sender + date) on the right
    const dateLine = join([t(letter.city) || t(ctx.personal.city), t(letter.date)], ', ');
    if (dateLine) doc.content.push({ text: dateLine, alignment: 'right', color: MUTED, fontSize: 10, margin: [0, 0, 0, 16] });

    // Recipient block
    const recipient = [t(letter.recipientName), t(letter.recipientTitle), t(letter.company), t(letter.address)].filter(Boolean);
    if (recipient.length) {
        doc.content.push({ stack: recipient.map((line, index) => ({ text: line, bold: index === 0, fontSize: 10.5 })), margin: [0, 0, 0, 18] });
    }

    if (t(letter.subject)) {
        const label = ctx.L('subject');
        doc.content.push({ text: [...(label ? [{ text: `${label}: `, bold: true, color: ctx.accent }] : []), { text: t(letter.subject), bold: true }], margin: [0, 0, 0, 14] });
    }

    if (t(letter.salutation)) {
        doc.content.push({ text: t(letter.salutation), margin: [0, 0, 0, 10] });
    }

    if (!isCoverLetterEmpty(letter)) {
        const paragraphs = textBlock(letter.body, { fontSize: 10.5 });
        doc.content.push(...paragraphs.map((node) => ({ ...node, margin: [0, 0, 0, 9] })));
    } else {
        doc.content.push({ text: '…', color: '#9CA3AF' });
    }

    doc.content.push({
        stack: [
            { text: t(letter.closing) || ctx.L('sincerely'), margin: [0, 10, 0, 22] },
            { text: ctx.hasName ? ctx.name : ctx.L('placeholderName'), bold: true },
        ],
        unbreakable: true,
    });

    return doc;
}
