/**
 * Document languages (Albanian, English, Italian) and the cover letter.
 * Run with: npm run test:js
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
    LANGUAGES,
    SCHEMA_VERSION,
    emptyProject,
    fileNamePart,
    isCoverLetterEmpty,
    letterFilePrefix,
    sectionTitle,
} from '../../resources/js/cv/schema.js';
import { longSampleProject, sampleProject } from '../../resources/js/cv/sample.js';
import { TEMPLATE_IDS, buildDocument } from '../../resources/js/cv/templates/index.js';
import { buildLetter } from '../../resources/js/cv/templates/letter.js';
import { parseProjectText, validateProject } from '../../resources/js/cv/validate.js';
import { docToBuffer, makePlaceholderPhotos, openPdf, pageText } from '../../scripts/pdf-node.mjs';

const photos = makePlaceholderPhotos(160);

async function textOf(definition) {
    const buffer = await docToBuffer(definition);
    const { task, doc } = await openPdf(buffer);
    const pages = [];
    for (let n = 1; n <= doc.numPages; n += 1) {
        pages.push(await pageText(doc, n));
    }
    await task.destroy();
    return { pages, text: pages.join('\n'), count: doc.numPages };
}

/** Headings are upper-cased and letter-spaced, so compare without spaces and case. */
const norm = (s) => s.replace(/\s+/g, '').toUpperCase();

const EXPECTED = {
    sq: { headings: ['Përvoja e punës', 'Praktika dhe përvoja e punës'], present: 'Aktualisht' },
    en: { headings: ['Work experience', 'Internships and work experience'], present: 'Present' },
    it: { headings: ['Esperienza lavorativa', 'Tirocini ed esperienza lavorativa'], present: 'Presente' },
    de: { headings: ['Berufserfahrung', 'Praktika und Berufserfahrung'], present: 'heute' },
    es: { headings: ['Experiencia laboral', 'Prácticas y experiencia laboral'], present: 'Actualidad' },
};

for (const language of LANGUAGES) {
    for (const id of TEMPLATE_IDS) {
        test(`${id}: renders section headings and labels in ${language}`, async () => {
            const project = sampleProject({ language, templateId: id });
            project.photo = { data: 'x', source: null, crop: null };
            const { text } = await textOf(buildDocument(project, photos));
            const flat = norm(text);
            assert.ok(EXPECTED[language].headings.some((h) => flat.includes(norm(h))), `no ${language} experience heading found`);
            assert.ok(flat.includes(norm(EXPECTED[language].present)), `missing "${EXPECTED[language].present}"`);
            // the other languages' headings must not leak in
            for (const other of LANGUAGES.filter((l) => l !== language)) {
                assert.ok(!flat.includes(norm(sectionTitle('skills', other))), `${other} heading leaked into ${language}`);
            }
        });
    }
}

test('sample projects are written in the requested language', () => {
    assert.match(sampleProject({ language: 'en' }).cv.summary, /Software developer/);
    assert.match(sampleProject({ language: 'it' }).cv.summary, /Sviluppatrice software/);
    assert.match(sampleProject({ language: 'sq' }).cv.summary, /Zhvilluese softueri/);
    assert.match(sampleProject({ language: 'de' }).cv.summary, /Softwareentwicklerin/);
    assert.match(sampleProject({ language: 'es' }).cv.summary, /Desarrolladora de software/);
    assert.equal(sampleProject({ language: 'en' }).design.language, 'en');
    assert.equal(sampleProject({ language: 'xx' }).design.language, 'sq');
});

for (const language of LANGUAGES) {
    test(`cover letter renders in ${language}`, async () => {
        const project = sampleProject({ language });
        const { text, count } = await textOf(buildLetter(project));
        assert.equal(count, 1);
        assert.match(text, /Arta Krasniqi/);
        assert.match(text, new RegExp(project.coverLetter.recipientName.split(' ').at(-1)));
        assert.match(text, new RegExp(project.coverLetter.closing.replace(/[,.]$/, '')));
        assert.match(text, /arta\.krasniqi@example\.com/);
        assert.match(text, /Prishtinë/);
    });
}

test('cover letter uses the localized default closing and subject label', async () => {
    for (const [language, closing, subject] of [
        ['sq', 'Me respekt', 'Lënda'],
        ['en', 'Yours sincerely', 'Subject'],
        ['it', 'Cordiali saluti', 'Oggetto'],
        ['de', 'Mit freundlichen Grüßen', 'Test'],
        ['es', 'Atentamente', 'Asunto'],
    ]) {
        const project = emptyProject({ language });
        project.cv.personal.firstName = 'Test';
        project.cv.personal.lastName = 'Person';
        project.coverLetter.subject = 'Test';
        project.coverLetter.body = 'Paragraph one.';
        const { text } = await textOf(buildLetter(project));
        assert.match(text, new RegExp(closing));
        assert.match(text, new RegExp(subject));
    }
});

test('a long cover letter spans several pages without blank pages', async () => {
    const project = longSampleProject();
    const { pages, count } = await textOf(buildLetter(project));
    assert.ok(count >= 2, `expected multiple pages, got ${count}`);
    for (const [index, text] of pages.entries()) {
        assert.ok(text.trim().length > 40, `letter page ${index + 1} is blank`);
    }
});

test('an empty cover letter still renders one page', async () => {
    const { count } = await textOf(buildLetter(emptyProject()));
    assert.equal(count, 1);
    assert.equal(isCoverLetterEmpty(emptyProject().coverLetter), true);
});

test('cover letter file prefixes and names', () => {
    assert.equal(letterFilePrefix('en'), 'Cover_Letter');
    assert.equal(letterFilePrefix('it'), 'Lettera_Motivazionale');
    assert.equal(letterFilePrefix('sq'), 'Leter_Motivimi');
    assert.equal(letterFilePrefix('de'), 'Anschreiben');
    assert.equal(letterFilePrefix('es'), 'Carta_de_presentacion');
    const project = sampleProject();
    assert.equal(`${letterFilePrefix('en')}_${fileNamePart(project)}.pdf`, 'Cover_Letter_Arta_Krasniqi.pdf');
});

test('cover letter and language survive an export/import round trip', () => {
    const original = sampleProject({ language: 'it' });
    const exported = JSON.parse(JSON.stringify({ ...original, exportedAt: new Date().toISOString() }));
    assert.equal(exported.schemaVersion, SCHEMA_VERSION);
    const result = validateProject(exported);
    assert.equal(result.ok, true, result.error);
    assert.equal(result.project.design.language, 'it');
    assert.deepEqual(result.project.coverLetter, original.coverLetter);
});

test('projects from schema version 1 (no letter, no language) still import', () => {
    const legacy = JSON.parse(JSON.stringify(sampleProject()));
    legacy.schemaVersion = 1;
    delete legacy.coverLetter;
    delete legacy.design.language;
    const result = validateProject(legacy);
    assert.equal(result.ok, true, result.error);
    assert.equal(result.project.design.language, 'sq');
    assert.equal(isCoverLetterEmpty(result.project.coverLetter), true);
});

test('cover letter fields are validated', () => {
    const tooLong = JSON.parse(JSON.stringify(emptyProject()));
    tooLong.coverLetter.body = 'a'.repeat(8001);
    assert.equal(validateProject(tooLong).ok, false);

    const wrongType = JSON.parse(JSON.stringify(emptyProject()));
    wrongType.coverLetter = 'not an object';
    assert.equal(validateProject(wrongType).ok, false);

    const badField = JSON.parse(JSON.stringify(emptyProject()));
    badField.coverLetter.subject = 12;
    assert.equal(validateProject(badField).ok, false);
});

test('import errors are returned in the requested language', () => {
    const bad = { format: 'other', schemaVersion: 1, cv: {} };
    assert.match(validateProject(bad, 'sq').error, /nuk është një projekt/);
    assert.match(validateProject(bad, 'en').error, /not a Krijo CV project/);
    assert.match(validateProject(bad, 'it').error, /non è un progetto/);
    assert.match(validateProject(bad, 'de').error, /kein Krijo-CV-Projekt/);
    assert.match(validateProject(bad, 'es').error, /no es un proyecto de Krijo CV/);

    assert.match(parseProjectText('{ nope', 'en').error, /not a valid JSON file/);
    assert.match(parseProjectText('{ nope', 'it').error, /non è un file JSON valido/);
    assert.match(parseProjectText('{ nope', 'sq').error, /JSON/);

    const long = JSON.parse(JSON.stringify(emptyProject()));
    long.cv.summary = 'a'.repeat(3001);
    assert.match(validateProject(long, 'en').error, /longer than 3000/);
    assert.match(validateProject(long, 'it').error, /più lungo di 3000/);
});
