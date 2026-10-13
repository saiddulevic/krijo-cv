/**
 * Registry of the CV templates. The slug is the stable identifier stored in
 * projects and in the admin panel's template metadata.
 */
import { L, MUTED, displayUrl, normalizeUrl, prepare } from './common.js';
import minimal from './minimal.js';
import modern from './modern.js';
import professional from './professional.js';
import executive from './executive.js';
import creative from './creative.js';
import academic from './academic.js';
import student from './student.js';
import technology from './technology.js';
import european from './european.js';
import compact from './compact.js';
import elegant from './elegant.js';
import timeline from './timeline.js';
import bold from './bold.js';
import duotone from './duotone.js';
import monogram from './monogram.js';

export const TEMPLATES = {
    minimal,
    modern,
    professional,
    executive,
    creative,
    academic,
    student,
    technology,
    european,
    compact,
    elegant,
    timeline,
    bold,
    duotone,
    monogram,
};

export const TEMPLATE_IDS = Object.keys(TEMPLATES);

export function hasTemplate(id) {
    return Object.prototype.hasOwnProperty.call(TEMPLATES, id);
}

/**
 * Builds the pdfmake document definition for a project.
 *
 * @param {object} project
 * @param {{ square: string, round: string } | null} photos data URLs of the processed photo
 * @param {string} [templateId] defaults to the project's template
 */
export function buildDocument(project, photos = null, templateId = project.design.templateId) {
    const build = hasTemplate(templateId) ? TEMPLATES[templateId] : TEMPLATES.minimal;
    const doc = build(prepare(project, photos));
    const qr = qrBlock(project, doc._qrLeft ?? 0);
    if (qr) doc.content.push(qr);
    delete doc._qrLeft;
    return doc;
}

/** The URL the optional QR code points to, or null when it is off or empty. */
export function qrTargetUrl(project) {
    const target = project.design?.qrTarget;
    if (target !== 'website' && target !== 'linkedin') return null;
    const value = project.cv.personal[target];
    return normalizeUrl(value) ? { href: normalizeUrl(value), text: displayUrl(value), target } : null;
}

/**
 * Small block with a QR code and its link, appended after the CV content.
 * Templates with a full-height coloured side panel pass an x offset so the
 * code sits on white paper in the main column.
 */
function qrBlock(project, left) {
    const url = qrTargetUrl(project);
    if (!url) return null;
    return {
        columns: [
            { width: 'auto', qr: url.href, fit: 66, foreground: '#111827', background: '#FFFFFF', eccLevel: 'M' },
            {
                width: '*',
                stack: [
                    { text: L(url.target === 'linkedin' ? 'qrLinkedin' : 'qrWebsite'), bold: true, fontSize: 8.5 },
                    { text: url.text, link: url.href, fontSize: 8.5, color: MUTED, margin: [0, 2, 0, 0] },
                ],
                margin: [10, 20, 0, 0],
            },
        ],
        columnGap: 0,
        unbreakable: true,
        margin: [left, 20, 0, 0],
    };
}
