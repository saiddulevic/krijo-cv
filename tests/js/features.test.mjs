/**
 * Writing help, quality check, undo/redo history, cover letter starters, Word
 * export and the QR code. Run with: npm run test:js
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { LANGUAGES, emptyProject } from '../../resources/js/cv/schema.js';
import { longSampleProject, sampleProject } from '../../resources/js/cv/sample.js';
import { ACTION_VERBS, PROFESSIONS, appendBullet, appendSentence } from '../../resources/js/cv/phrases.js';
import { analyzeProject } from '../../resources/js/cv/quality.js';
import { History, restoreSnapshot, snapshotOf } from '../../resources/js/cv/history.js';
import { LETTER_TYPES, letterSkeleton } from '../../resources/js/cv/letters.js';
import { buildCvDocx, buildLetterDocx, docxToBuffer } from '../../resources/js/cv/docx/export.js';
import { TEMPLATE_IDS, buildDocument, qrTargetUrl } from '../../resources/js/cv/templates/index.js';
import { validateProject } from '../../resources/js/cv/validate.js';
import { ROOT, docToBuffer, makePlaceholderPhotos, openPdf, pageText } from '../../scripts/pdf-node.mjs';

const JSZip = (await import(pathToFileURL(path.join(ROOT, 'node_modules/jszip/lib/index.js')).href)).default;

/* ---------------------------------------------------------------- phrases */

test('every profession has summaries, bullets and skills in all three languages', () => {
    assert.ok(PROFESSIONS.length >= 12);
    const ids = new Set();
    for (const profession of PROFESSIONS) {
        assert.ok(!ids.has(profession.id), `duplicate profession ${profession.id}`);
        ids.add(profession.id);
        for (const lang of LANGUAGES) {
            assert.ok(profession.label[lang], `${profession.id} label ${lang}`);
            assert.ok(profession.summaries[lang].length >= 2, `${profession.id} summaries ${lang}`);
            assert.ok(profession.bullets[lang].length >= 6, `${profession.id} bullets ${lang}`);
            assert.ok(profession.skills[lang].length >= 6, `${profession.id} skills ${lang}`);
            assert.equal(profession.summaries[lang].length, profession.summaries.sq.length);
            assert.equal(profession.bullets[lang].length, profession.bullets.sq.length);
        }
    }
    for (const lang of LANGUAGES) assert.equal(ACTION_VERBS[lang].length, ACTION_VERBS.sq.length);
});

test('phrases are appended without losing existing text', () => {
    assert.equal(appendBullet('', 'Line one.'), '- Line one.');
    assert.equal(appendBullet('Intro text\n', 'Line two.'), 'Intro text\n- Line two.');
    assert.equal(appendSentence('', 'First.'), 'First.');
    assert.equal(appendSentence('First.', 'Second.'), 'First. Second.');
});

/* ---------------------------------------------------------------- quality */

test('an empty project scores low and lists the main problems', () => {
    const result = analyzeProject(emptyProject());
    assert.ok(result.score < 30, `score ${result.score}`);
    const ids = result.issues.map((issue) => issue.id);
    for (const id of ['name', 'email', 'summary', 'experience', 'education', 'skills']) {
        assert.ok(ids.includes(id), `missing issue ${id}`);
    }
    assert.equal(result.issues[0].level, 'error');
});

test('the sample CV scores well', () => {
    const result = analyzeProject(sampleProject(), { pages: 2 });
    assert.ok(result.score >= 90, `score ${result.score}: ${result.issues.map((i) => i.id).join(', ')}`);
    assert.ok(['excellent', 'good'].includes(result.grade));
});

test('placeholders left from the phrase library are reported with their step', () => {
    const project = sampleProject();
    project.cv.experience[0].description = appendBullet(project.cv.experience[0].description, PROFESSIONS[0].bullets.sq[0]);
    const issue = analyzeProject(project).issues.find((i) => i.id === 'placeholders');
    assert.ok(issue, 'placeholder issue expected');
    assert.equal(issue.level, 'error');
    assert.equal(issue.step, 2);
    assert.equal(issue.params.n, 1);

    const letter = sampleProject();
    letter.coverLetter.body = letterSkeleton('general', letter).body;
    assert.equal(analyzeProject(letter).issues.find((i) => i.id === 'placeholders')?.step, 4);
});

test('quality checks for length, dates, skills and the letter', () => {
    const project = sampleProject();
    project.cv.skills = project.cv.skills.slice(0, 3);
    project.cv.experience[1].startDate = 'Shtator 2019';
    project.coverLetter.company = '';
    const ids = analyzeProject(project, { pages: 4 }).issues.map((i) => i.id);
    assert.ok(ids.includes('skills'));
    assert.ok(ids.includes('dateFormat'));
    assert.ok(ids.includes('length'));
    assert.ok(ids.includes('letterDetails'));

    const noLetter = sampleProject();
    noLetter.coverLetter.body = '';
    assert.ok(!analyzeProject(noLetter).checks.some((c) => c.id === 'letterDetails'), 'letter check must not apply without a letter');
});

/* ---------------------------------------------------------------- history */

test('undo and redo walk through snapshots without duplicating the photo', () => {
    const project = sampleProject();
    project.photo = { data: 'data:image/jpeg;base64,AAAA', source: null, crop: { zoom: 1, ox: 0, oy: 0 } };
    const history = new History(3);
    history.reset(snapshotOf(project));
    assert.equal(history.canUndo, false);

    project.cv.personal.firstName = 'Blerta';
    assert.equal(history.record(snapshotOf(project)), true);
    assert.equal(history.record(snapshotOf(project)), false, 'identical state is not recorded twice');
    assert.ok(!snapshotOf(project).json.includes('base64,AAAA'), 'photo data stays out of the JSON');

    project.cv.experience.splice(0, 1);
    history.record(snapshotOf(project));

    const back = restoreSnapshot(history.undo());
    assert.equal(back.cv.experience.length, 3);
    assert.equal(back.cv.personal.firstName, 'Blerta');
    assert.equal(back.photo.data, 'data:image/jpeg;base64,AAAA');

    const first = restoreSnapshot(history.undo());
    assert.equal(first.cv.personal.firstName, 'Arta');
    assert.equal(history.canUndo, false);

    const forward = restoreSnapshot(history.redo());
    assert.equal(forward.cv.personal.firstName, 'Blerta');
    assert.equal(history.canRedo, true);

    for (let i = 0; i < 6; i += 1) {
        project.cv.summary = `Version ${i}`;
        history.record(snapshotOf(project));
    }
    assert.equal(history.past.length, 3, 'history is capped at the limit');
    assert.equal(history.canRedo, false, 'a new change clears the redo stack');
});

/* ---------------------------------------------------------------- letter starters */

test('letter starters exist for every type and language and use project data', () => {
    for (const type of LETTER_TYPES) {
        for (const language of LANGUAGES) {
            const project = sampleProject({ language });
            const skeleton = letterSkeleton(type.id, project);
            assert.ok(skeleton.body.split('\n\n').length >= 3, `${type.id}/${language} paragraphs`);
            assert.ok(skeleton.subject && skeleton.salutation && skeleton.closing);
            assert.ok(!skeleton.body.includes('{company}') && !skeleton.body.includes('{title}'));
            if (skeleton.body.includes(project.coverLetter.company) === false) {
                assert.fail(`${type.id}/${language} does not use the company name`);
            }
        }
    }
    const empty = letterSkeleton('general', emptyProject({ language: 'en' }));
    assert.match(empty.body, /\[Company\]/);
    assert.match(empty.body, /\[your job title\]/);
});

/* ---------------------------------------------------------------- Word export */

async function docxText(document) {
    const buffer = await docxToBuffer(document);
    assert.equal(buffer.subarray(0, 2).toString(), 'PK');
    const zip = await JSZip.loadAsync(buffer);
    return { xml: await zip.file('word/document.xml').async('string'), files: Object.keys(zip.files) };
}

for (const language of LANGUAGES) {
    test(`Word export of the CV and the letter in ${language}`, async () => {
        const project = sampleProject({ language });
        project.photo = { data: 'x', source: null, crop: null };
        const cv = await docxText(buildCvDocx(project, makePlaceholderPhotos(120)));
        assert.match(cv.xml, /Arta Krasniqi/);
        assert.match(cv.xml, /arta\.krasniqi@example\.com/);
        assert.ok(cv.files.some((file) => file.startsWith('word/media/') && file.endsWith('.jpg')), 'photo embedded');
        assert.match(cv.xml, /w:hyperlink/);
        const heading = { sq: 'PËRVOJA E PUNËS', en: 'WORK EXPERIENCE', it: 'ESPERIENZA LAVORATIVA', de: 'BERUFSERFAHRUNG', es: 'EXPERIENCIA LABORAL' }[language];
        assert.ok(cv.xml.includes(heading), `heading ${heading}`);

        const letter = await docxText(buildLetterDocx(project));
        assert.ok(letter.xml.includes(project.coverLetter.subject.replace(/&/g, '&amp;')));
        assert.ok(letter.xml.includes(project.coverLetter.closing));
    });
}

test('Word export of an empty or long project does not fail', async () => {
    await docxText(buildCvDocx(emptyProject(), null));
    await docxText(buildLetterDocx(emptyProject()));
    const long = await docxText(buildCvDocx(longSampleProject(), null));
    assert.match(long.xml, /Projekti i gjatë 5/);
});

/* ---------------------------------------------------------------- QR code */

test('the QR target is validated and resolved to a link', () => {
    const project = sampleProject();
    assert.equal(qrTargetUrl(project), null);
    project.design.qrTarget = 'website';
    assert.deepEqual(qrTargetUrl(project), { href: 'https://arta-krasniqi.example', text: 'arta-krasniqi.example', target: 'website' });
    project.design.qrTarget = 'linkedin';
    assert.equal(qrTargetUrl(project).href, 'https://linkedin.com/in/arta-krasniqi-shembull');
    project.cv.personal.linkedin = '';
    assert.equal(qrTargetUrl(project), null);

    const raw = JSON.parse(JSON.stringify(sampleProject()));
    raw.design.qrTarget = 'javascript:alert(1)';
    assert.equal(validateProject(raw).project.design.qrTarget, '');
    raw.design.qrTarget = 'website';
    assert.equal(validateProject(raw).project.design.qrTarget, 'website');
});

for (const id of TEMPLATE_IDS) {
    test(`${id}: renders with a QR code without extra blank pages`, async () => {
        const project = sampleProject({ templateId: id });
        project.design.qrTarget = 'website';
        const definition = buildDocument(project, null);
        assert.ok(JSON.stringify(definition.content).includes('"qr":"https://arta-krasniqi.example"'));
        assert.equal(definition._qrLeft, undefined);
        const { task, doc } = await openPdf(await docToBuffer(definition));
        const last = await pageText(doc, doc.numPages);
        await task.destroy();
        assert.match(last, /arta-krasniqi\.example/);
    });
}
