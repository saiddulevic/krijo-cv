/**
 * Renders every template with an empty project, the short sample and a long
 * multi-page sample, with and without a photo, through the real pdfmake
 * pipeline. Run with: npm run test:js
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { emptyProject } from '../../resources/js/cv/schema.js';
import { longSampleProject, sampleProject } from '../../resources/js/cv/sample.js';
import { TEMPLATE_IDS, buildDocument } from '../../resources/js/cv/templates/index.js';
import { docToBuffer, makePlaceholderPhotos, openPdf, pageText } from '../../scripts/pdf-node.mjs';

const photos = makePlaceholderPhotos(160);

async function render(project, templateId, withPhoto) {
    project.design.templateId = templateId;
    project.photo = withPhoto ? { data: 'x', source: null, crop: null } : null;
    const definition = buildDocument(project, withPhoto ? photos : null);
    const buffer = await docToBuffer(definition);
    const { task, doc } = await openPdf(buffer);
    const texts = [];
    for (let n = 1; n <= doc.numPages; n += 1) {
        texts.push(await pageText(doc, n));
    }
    await task.destroy();
    return { bytes: buffer.length, pages: doc.numPages, text: texts.join('\n'), pageTexts: texts };
}

test('all fifteen templates are registered', () => {
    assert.deepEqual(TEMPLATE_IDS, [
        'minimal', 'modern', 'professional', 'executive', 'creative',
        'academic', 'student', 'technology', 'european', 'compact',
        'elegant', 'timeline', 'bold', 'duotone', 'monogram',
    ]);
});

for (const id of TEMPLATE_IDS) {
    test(`${id}: empty project renders a single page`, async () => {
        const result = await render(emptyProject(), id, false);
        assert.ok(result.bytes > 1000);
        assert.equal(result.pages, 1);
    });

    test(`${id}: short CV with photo keeps Albanian characters and links`, async () => {
        const result = await render(sampleProject(), id, true);
        assert.ok(result.pages >= 1 && result.pages <= 3, `unexpected page count ${result.pages}`);
        assert.match(result.text, /Arta Krasniqi/);
        assert.match(result.text, /Prishtinë/);
        assert.match(result.text, /Përvoja|Praktika|Arsimi/);
        assert.match(result.text, /arta\.krasniqi@example\.com/);
        assert.doesNotMatch(result.pageTexts.at(-1), /^\s*$/, 'last page must not be blank');
    });

    test(`${id}: short CV without photo renders`, async () => {
        const result = await render(sampleProject(), id, false);
        assert.ok(result.pages >= 1);
    });

    test(`${id}: long CV spans several pages without blank pages`, async () => {
        const result = await render(longSampleProject(), id, true);
        assert.ok(result.pages >= 2, `expected multiple pages, got ${result.pages}`);
        for (const [index, text] of result.pageTexts.entries()) {
            assert.ok(text.trim().length > 40, `page ${index + 1} is (nearly) blank`);
        }
        assert.match(result.text, /Projekti i gjatë 5/);
    });

    test(`${id}: hides empty sections`, async () => {
        const project = sampleProject();
        project.cv.publications = [];
        project.cv.references = [];
        project.cv.custom = [];
        const result = await render(project, id, false);
        assert.doesNotMatch(result.text, /Publikimet|Referencat|Interesat/i);
    });
}

test('template switching keeps the data: every template shows the same entries', async () => {
    const project = sampleProject();
    for (const id of TEMPLATE_IDS) {
        const result = await render(project, id, false);
        assert.match(result.text, /Teknova Shembull/);
        assert.match(result.text, /Universiteti i Prishtinës/);
        assert.match(result.text, /Gjermanisht/);
    }
});
