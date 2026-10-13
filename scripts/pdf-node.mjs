/**
 * Node helpers shared by the thumbnail generator and the template tests.
 * They run the exact template code used in the browser through pdfmake's
 * server build and rasterise pages with PDF.js + @napi-rs/canvas.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const FONT_DIR = path.join(ROOT, 'public', 'fonts');

let printer = null;

export function getPdfMake() {
    if (printer) return printer;
    const pdfmake = require(path.join(ROOT, 'node_modules/pdfmake/js/index.js'));
    pdfmake.setLocalAccessPolicy((file) => path.resolve(file).startsWith(FONT_DIR));
    pdfmake.setUrlAccessPolicy(() => false);
    pdfmake.setFonts({
        Inter: {
            normal: path.join(FONT_DIR, 'inter/Inter-Regular.ttf'),
            bold: path.join(FONT_DIR, 'inter/Inter-Bold.ttf'),
            italics: path.join(FONT_DIR, 'inter/Inter-Italic.ttf'),
            bolditalics: path.join(FONT_DIR, 'inter/Inter-BoldItalic.ttf'),
        },
        PTSerif: {
            normal: path.join(FONT_DIR, 'pt-serif/PTSerif-Regular.ttf'),
            bold: path.join(FONT_DIR, 'pt-serif/PTSerif-Bold.ttf'),
            italics: path.join(FONT_DIR, 'pt-serif/PTSerif-Italic.ttf'),
            bolditalics: path.join(FONT_DIR, 'pt-serif/PTSerif-BoldItalic.ttf'),
        },
    });
    printer = pdfmake;
    return printer;
}

export async function docToBuffer(docDefinition) {
    return getPdfMake().createPdf(docDefinition).getBuffer();
}

let pdfjsPromise = null;
export function getPdfjs() {
    if (!pdfjsPromise) {
        pdfjsPromise = import(pathToFileURL(path.join(ROOT, 'node_modules/pdfjs-dist/legacy/build/pdf.mjs')).href);
    }
    return pdfjsPromise;
}

export function getCanvas() {
    return require(path.join(ROOT, 'node_modules/@napi-rs/canvas'));
}

/** Opens a PDF buffer; remember to call task.destroy() when done. */
export async function openPdf(buffer) {
    const pdfjs = await getPdfjs();
    const task = pdfjs.getDocument({ data: new Uint8Array(buffer), useSystemFonts: false, isEvalSupported: false });
    const doc = await task.promise;
    return { task, doc };
}

export async function renderPageToPng(doc, pageNumber, scale = 1) {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const { createCanvas } = getCanvas();
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, canvas, viewport }).promise;
    return canvas.toBuffer('image/png');
}

export async function pageText(doc, pageNumber) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent();
    return content.items.map((item) => item.str).join(' ');
}

/**
 * A clearly fictional placeholder "photo": soft background with an abstract
 * silhouette. Returned as the { square, round } data URL pair templates expect.
 */
export function makePlaceholderPhotos(size = 640) {
    const { createCanvas } = getCanvas();
    const square = createCanvas(size, size);
    const ctx = square.getContext('2d');
    ctx.fillStyle = '#D9DEE7';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#8F9AAE';
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.4, size * 0.19, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size / 2, size * 0.98, size * 0.36, size * 0.34, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    const round = createCanvas(size, size);
    const rctx = round.getContext('2d');
    rctx.beginPath();
    rctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    rctx.closePath();
    rctx.clip();
    rctx.drawImage(square, 0, 0);

    return {
        square: `data:image/jpeg;base64,${square.toBuffer('image/jpeg', 86).toString('base64')}`,
        round: `data:image/png;base64,${round.toBuffer('image/png').toString('base64')}`,
    };
}

export function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}
