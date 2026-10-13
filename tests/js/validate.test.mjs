/**
 * Import validation and export/import round-trip tests. Run with: npm run test:js
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FORMAT, LIMITS, SCHEMA_VERSION, emptyProject, fileNamePart, normalizeSectionOrder } from '../../resources/js/cv/schema.js';
import { sampleProject } from '../../resources/js/cv/sample.js';
import { parseProjectText, validateProject } from '../../resources/js/cv/validate.js';

const tinyJpeg =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/yQALCAABAAEBAREA/8wABgAQEAX/2gAIAQEAAD8A0s8g/9k=';

function exportLike(project) {
    return JSON.parse(JSON.stringify({ ...project, exportedAt: new Date().toISOString() }));
}

test('a sample project survives an export/import round trip', () => {
    const original = sampleProject();
    original.photo = { data: tinyJpeg, source: tinyJpeg, crop: { zoom: 1.4, ox: -0.2, oy: -0.1 } };
    original.design.templateId = 'creative';
    original.design.accentColor = '#1D4ED8';
    original.design.showPhoto = false;

    const result = validateProject(exportLike(original));
    assert.equal(result.ok, true, result.error);
    const imported = result.project;

    assert.deepEqual(imported.cv.personal, original.cv.personal);
    assert.equal(imported.cv.summary, original.cv.summary);
    assert.equal(imported.cv.experience.length, original.cv.experience.length);
    assert.equal(imported.cv.experience[0].title, original.cv.experience[0].title);
    assert.equal(imported.cv.experience[0].current, true);
    assert.equal(imported.cv.skills.length, original.cv.skills.length);
    assert.equal(imported.cv.custom[0].title, 'Interesat');
    assert.equal(imported.cv.custom[0].entries.length, 3);
    assert.equal(imported.photo.data, tinyJpeg);
    assert.deepEqual(imported.photo.crop, { zoom: 1.4, ox: -0.2, oy: -0.1 });
    assert.equal(imported.design.templateId, 'creative');
    assert.equal(imported.design.accentColor, '#1D4ED8');
    assert.equal(imported.design.showPhoto, false);
    // custom section ids are regenerated, but the order position is kept
    const customIndexOriginal = original.design.sectionOrder.findIndex((k) => k.startsWith('custom:'));
    const customIndexImported = imported.design.sectionOrder.findIndex((k) => k.startsWith('custom:'));
    assert.equal(customIndexImported, customIndexOriginal);
    assert.equal(imported.design.sectionOrder.length, original.design.sectionOrder.length);
});

test('ids are regenerated and unknown keys dropped on import', () => {
    const raw = exportLike(sampleProject());
    raw.cv.experience[0].id = 'evil';
    raw.cv.experience[0].__proto__polluted = true;
    raw.cv.experience[0].onclick = 'alert(1)';
    raw.extra = { nested: true };
    const result = validateProject(raw);
    assert.equal(result.ok, true);
    assert.notEqual(result.project.cv.experience[0].id, 'evil');
    assert.equal('onclick' in result.project.cv.experience[0], false);
    assert.equal('extra' in result.project, false);
});

test('rejects files that are not Krijo CV projects', () => {
    assert.equal(validateProject(null).ok, false);
    assert.equal(validateProject([]).ok, false);
    assert.equal(validateProject({ format: 'other', schemaVersion: 1, cv: {} }).ok, false);
    assert.equal(validateProject({ format: FORMAT, schemaVersion: 1 }).ok, false);
    const future = validateProject({ format: FORMAT, schemaVersion: SCHEMA_VERSION + 1, cv: {} });
    assert.equal(future.ok, false);
    assert.match(future.error, /version/i);
});

test('rejects malformed JSON with an Albanian message', () => {
    const result = parseProjectText('{ not json');
    assert.equal(result.ok, false);
    assert.match(result.error, /JSON/);
});

test('rejects wrong field types and oversized text', () => {
    const base = exportLike(emptyProject());
    base.cv.personal.firstName = 42;
    assert.equal(validateProject(base).ok, false);

    const long = exportLike(emptyProject());
    long.cv.summary = 'a'.repeat(LIMITS.summary + 1);
    const result = validateProject(long);
    assert.equal(result.ok, false);
    assert.match(result.error, /Përmbledhja/);

    const many = exportLike(emptyProject());
    many.cv.experience = Array.from({ length: LIMITS.entries + 1 }, () => ({ title: 'x' }));
    assert.equal(validateProject(many).ok, false);

    const badBool = exportLike(emptyProject());
    badBool.cv.experience = [{ title: 'x', current: 'yes' }];
    assert.equal(validateProject(badBool).ok, false);
});

test('rejects invalid embedded images', () => {
    const svg = exportLike(emptyProject());
    svg.photo = { data: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=' };
    assert.equal(validateProject(svg).ok, false);

    const html = exportLike(emptyProject());
    html.photo = { data: '<img src=x onerror=alert(1)>' };
    assert.equal(validateProject(html).ok, false);

    const huge = exportLike(emptyProject());
    huge.photo = { data: `data:image/png;base64,${'A'.repeat(LIMITS.photoChars + 10)}` };
    assert.equal(validateProject(huge).ok, false);
});

test('falls back to safe design defaults', () => {
    const raw = exportLike(emptyProject());
    raw.design = { templateId: '../evil', accentColor: 'javascript:alert(1)', showPhoto: 'yes', sectionOrder: ['bogus', 'education', 'education'] };
    const result = validateProject(raw);
    assert.equal(result.ok, true);
    assert.equal(result.project.design.templateId, 'minimal');
    assert.equal(result.project.design.accentColor, '#C1121F');
    assert.equal(result.project.design.showPhoto, true);
    assert.equal(result.project.design.sectionOrder[0], 'education');
    assert.equal(new Set(result.project.design.sectionOrder).size, result.project.design.sectionOrder.length);
});

test('control characters are stripped but newlines kept', () => {
    const raw = exportLike(emptyProject());
    raw.cv.summary = 'Rreshti 1\nRreshti 2\u0000\u0007';
    const result = validateProject(raw);
    assert.equal(result.ok, true);
    assert.equal(result.project.cv.summary, 'Rreshti 1\nRreshti 2');
});

test('section order normalisation', () => {
    const order = normalizeSectionOrder(['skills', 'custom:a', 'nope'], [{ id: 'a' }, { id: 'b' }]);
    assert.equal(order[0], 'skills');
    assert.equal(order[1], 'custom:a');
    assert.ok(order.includes('custom:b'));
    assert.equal(order.includes('nope'), false);
});

test('file names keep Albanian letters and drop unsafe characters', () => {
    const project = emptyProject();
    project.cv.personal.firstName = 'Çlirim';
    project.cv.personal.lastName = 'Zëri / Hoxha';
    assert.equal(fileNamePart(project), 'Çlirim_Zëri-Hoxha');
    assert.equal(fileNamePart(emptyProject()), 'CV');
});
