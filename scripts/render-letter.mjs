/**
 * Debug helper: renders the sample cover letter to PNG files.
 *   node scripts/render-letter.mjs <sq|en|it> <templateId> <outDir> [scale]
 */
import fs from 'node:fs';
import path from 'node:path';
import { sampleProject } from '../resources/js/cv/sample.js';
import { buildLetter } from '../resources/js/cv/templates/letter.js';
import { docToBuffer, ensureDir, openPdf, renderPageToPng } from './pdf-node.mjs';

const [language = 'sq', templateId = 'minimal', outDir = 'storage/app/render-pages', scaleArg = '0.8'] = process.argv.slice(2);
ensureDir(outDir);
const project = sampleProject({ language, templateId, accentColor: '#C1121F' });
const buffer = await docToBuffer(buildLetter(project));
const { task, doc } = await openPdf(buffer);
for (let n = 1; n <= doc.numPages; n += 1) {
    const file = path.join(outDir, `letter-${language}-${templateId}-${n}.png`);
    fs.writeFileSync(file, await renderPageToPng(doc, n, Number(scaleArg)));
    console.log(file);
}
await task.destroy();
