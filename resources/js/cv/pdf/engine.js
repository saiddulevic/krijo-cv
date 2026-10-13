/**
 * Browser-side PDF generation with pdfmake 0.3. The library and the fonts are
 * loaded lazily the first time a PDF is needed. Fonts are fetched from this
 * site only (public/fonts) and cached in pdfmake's virtual file system.
 */
import { buildDocument } from '../templates/index.js';
import { buildLetter } from '../templates/letter.js';

const FONT_FILES = {
    Inter: {
        normal: 'inter/Inter-Regular.ttf',
        bold: 'inter/Inter-Bold.ttf',
        italics: 'inter/Inter-Italic.ttf',
        bolditalics: 'inter/Inter-BoldItalic.ttf',
    },
    PTSerif: {
        normal: 'pt-serif/PTSerif-Regular.ttf',
        bold: 'pt-serif/PTSerif-Bold.ttf',
        italics: 'pt-serif/PTSerif-Italic.ttf',
        bolditalics: 'pt-serif/PTSerif-BoldItalic.ttf',
    },
};

let pdfMakePromise = null;

export function fontBaseUrl() {
    return `${window.location.origin}/fonts/`;
}

export function loadPdfMake() {
    if (!pdfMakePromise) {
        pdfMakePromise = import('pdfmake/build/pdfmake.js')
            .then((mod) => {
                const pdfMake = mod.default ?? mod;
                const base = fontBaseUrl();
                const fonts = {};
                for (const [family, files] of Object.entries(FONT_FILES)) {
                    fonts[family] = {};
                    for (const [variant, file] of Object.entries(files)) {
                        fonts[family][variant] = base + file;
                    }
                }
                pdfMake.setFonts(fonts);
                // Only this site's font files may ever be fetched by pdfmake.
                pdfMake.setUrlAccessPolicy((url) => url.startsWith(base));
                return pdfMake;
            })
            .catch((error) => {
                pdfMakePromise = null;
                throw error;
            });
    }
    return pdfMakePromise;
}

/**
 * Generates the PDF for a project. The same function serves the preview and
 * the download, so both always show the identical document.
 *
 * @param {object} project
 * @param {{ square: string, round: string } | null} photos
 * @returns {Promise<Blob>}
 */
export async function generatePdfBlob(project, photos) {
    const pdfMake = await loadPdfMake();
    const docDefinition = buildDocument(project, photos);
    return pdfMake.createPdf(docDefinition).getBlob();
}

/**
 * Generates the cover letter PDF for a project (same identity block, accent
 * colour and fonts as the CV).
 *
 * @param {object} project
 * @returns {Promise<Blob>}
 */
export async function generateLetterBlob(project) {
    const pdfMake = await loadPdfMake();
    return pdfMake.createPdf(buildLetter(project)).getBlob();
}

/** Triggers a browser download of a blob and releases the temporary URL. */
export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
