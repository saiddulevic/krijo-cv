/**
 * Debug helper: renders every page of a template to PNG files.
 *   node scripts/render-pages.mjs <templateId|all> <short|long> <outDir> [scale]
 */
import fs from 'node:fs';
import path from 'node:path';
import { longSampleProject, sampleProject } from '../resources/js/cv/sample.js';
import { TEMPLATE_IDS, buildDocument } from '../resources/js/cv/templates/index.js';
import { docToBuffer, ensureDir, makePlaceholderPhotos, openPdf, renderPageToPng } from './pdf-node.mjs';

const [which = 'all', size = 'long', outDir = 'storage/app/render-pages', scaleArg = '0.6'] = process.argv.slice(2);
const ids = which === 'all' ? TEMPLATE_IDS : [which];
const scale = Number(scaleArg);
ensureDir(outDir);
const photos = makePlaceholderPhotos();

for (const id of ids) {
    const project = size === 'long' ? longSampleProject() : sampleProject();
    project.photo = { data: 'placeholder', source: null, crop: null };
    project.design.templateId = id;
    const buffer = await docToBuffer(buildDocument(project, photos));
    const { task, doc } = await openPdf(buffer);
    for (let n = 1; n <= doc.numPages; n += 1) {
        fs.writeFileSync(path.join(outDir, `${id}-${size}-${n}.png`), await renderPageToPng(doc, n, scale));
    }
    console.log(`${id}: ${doc.numPages} pages`);
    await task.destroy();
}
