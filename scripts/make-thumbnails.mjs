/**
 * Generates the template preview thumbnails (public/images/templates/<slug>.png)
 * from the real templates using the fictional sample CV.
 *
 *   node scripts/make-thumbnails.mjs [--out public/images/templates] [--scale 0.7]
 */
import fs from 'node:fs';
import path from 'node:path';
import { sampleProject } from '../resources/js/cv/sample.js';
import { TEMPLATE_IDS, buildDocument } from '../resources/js/cv/templates/index.js';
import { ROOT, docToBuffer, ensureDir, makePlaceholderPhotos, openPdf, renderPageToPng } from './pdf-node.mjs';

const args = process.argv.slice(2);
const option = (name, fallback) => {
    const index = args.indexOf(`--${name}`);
    return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const outDir = path.resolve(ROOT, option('out', 'public/images/templates'));
const scale = Number(option('scale', '0.7'));
ensureDir(outDir);

const project = sampleProject();
project.photo = { data: 'placeholder', source: null, crop: null };
const photos = makePlaceholderPhotos();

for (const id of TEMPLATE_IDS) {
    project.design.templateId = id;
    const buffer = await docToBuffer(buildDocument(project, photos));
    const { task, doc } = await openPdf(buffer);
    const png = await renderPageToPng(doc, 1, scale);
    await task.destroy();
    const file = path.join(outDir, `${id}.png`);
    fs.writeFileSync(file, png);
    console.log(`${id.padEnd(13)} ${doc.numPages} page(s)  ${path.relative(ROOT, file)}  ${(png.length / 1024).toFixed(0)} KB`);
}
