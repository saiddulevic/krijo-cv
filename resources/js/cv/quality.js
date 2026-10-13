/**
 * CV quality check: a weighted list of checks computed in the browser. Each
 * check has an id (its message key in the UI is `q_<id>`), a level, a weight,
 * the builder step where it can be fixed and optional message parameters.
 * Checks that do not apply (e.g. letter checks without a letter) are left out
 * of the score.
 */
import { isCoverLetterEmpty, isEntryEmpty } from './schema.js';

const PLACEHOLDER = /\[[^\]\n]{1,40}\]/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const t = (value) => (value ?? '').toString().trim();

function dateKind(value) {
    const v = t(value);
    if (!v) return null;
    if (/^\d{1,2}[./-]\d{4}$/.test(v)) return 'month';
    if (/^\d{4}$/.test(v)) return 'year';
    return 'text';
}

/** Every string value in the CV and the cover letter, for the placeholder scan. */
function allTexts(project) {
    const texts = [];
    const walk = (value) => {
        if (typeof value === 'string') texts.push(value);
        else if (Array.isArray(value)) value.forEach(walk);
        else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => k !== 'id' && walk(v));
    };
    walk(project.cv);
    walk(project.coverLetter);
    return texts;
}

/** First step that still contains a placeholder, so the UI can jump there. */
function placeholderStep(project) {
    const cv = project.cv;
    const has = (value) => {
        let found = false;
        const walk = (v) => {
            if (found) return;
            if (typeof v === 'string') found = PLACEHOLDER.test(v);
            else if (Array.isArray(v)) v.forEach(walk);
            else if (v && typeof v === 'object') Object.values(v).forEach(walk);
        };
        walk(value);
        return found;
    };
    if (has(cv.personal)) return 1;
    if (has(cv.summary) || has(cv.experience)) return 2;
    if (has([cv.education, cv.skills, cv.languages, cv.certifications, cv.projects, cv.volunteer, cv.publications, cv.references, cv.custom])) return 3;
    return 4;
}

/**
 * @param {object} project
 * @param {{ pages?: number }} [context] pages: page count of the rendered CV, when known
 * @returns {{ score: number, grade: string, checks: Array, issues: Array, passed: number }}
 */
export function analyzeProject(project, context = {}) {
    const cv = project.cv;
    const p = cv.personal;
    const checks = [];
    const add = (id, ok, { level = 'warn', weight = 5, step = 1, params = {} } = {}) => {
        checks.push({ id, ok: Boolean(ok), level, weight, step, params });
    };

    const experience = cv.experience.filter((e) => !isEntryEmpty(e));
    const education = cv.education.filter((e) => !isEntryEmpty(e));
    const skills = cv.skills.filter((e) => !isEntryEmpty(e));
    const languages = cv.languages.filter((e) => !isEntryEmpty(e));
    const projects = cv.projects.filter((e) => !isEntryEmpty(e));
    const volunteer = cv.volunteer.filter((e) => !isEntryEmpty(e));

    add('name', t(p.firstName) && t(p.lastName), { level: 'error', weight: 10, step: 1 });
    add('title', t(p.title), { weight: 5, step: 1 });
    add('email', EMAIL.test(t(p.email)), { level: 'error', weight: 8, step: 1 });
    add('phone', t(p.phone), { weight: 5, step: 1 });
    add('location', t(p.city) || t(p.country), { level: 'tip', weight: 3, step: 1 });
    add('link', t(p.linkedin) || t(p.website), { level: 'tip', weight: 2, step: 1 });

    const summary = t(cv.summary);
    add('summary', summary, { weight: 8, step: 2 });
    if (summary) {
        add('summaryLength', summary.length >= 150 && summary.length <= 900, {
            level: 'tip',
            weight: 4,
            step: 2,
            params: { length: summary.length, min: 150, max: 900 },
        });
    }

    add('experience', experience.length > 0 || projects.length > 0 || volunteer.length > 0, { weight: 10, step: 2 });

    if (experience.length) {
        const incomplete = experience.filter((e) => !t(e.title) || !t(e.employer) || !t(e.startDate)).length;
        add('experienceDetails', incomplete === 0, { weight: 8, step: 2, params: { n: incomplete } });

        const withoutText = experience.filter((e) => !t(e.description)).length;
        add('experienceDescriptions', withoutText === 0, { weight: 6, step: 2, params: { n: withoutText } });

        const withNumbers = experience.some((e) => /\d/.test(t(e.description).replace(PLACEHOLDER, '')));
        add('achievements', withNumbers, { level: 'tip', weight: 5, step: 2 });

        // Within one section all dates should look alike (years only for
        // education next to month/year for jobs is fine).
        const mixed = [experience, education, volunteer].some((list) => {
            const kinds = new Set(list.flatMap((e) => [e.startDate, e.current ? '' : e.endDate]).map(dateKind).filter(Boolean));
            return kinds.size > 1;
        });
        add('dateFormat', !mixed, { level: 'tip', weight: 3, step: 2 });
    }

    add('education', education.length > 0, { weight: 8, step: 3 });
    add('skills', skills.length >= 5, { weight: 6, step: 3, params: { count: skills.length, min: 5 } });
    add('languages', languages.length > 0, { level: 'tip', weight: 4, step: 3 });

    const placeholders = allTexts(project).filter((text) => PLACEHOLDER.test(text)).length;
    add('placeholders', placeholders === 0, { level: 'error', weight: 10, step: placeholders ? placeholderStep(project) : 2, params: { n: placeholders } });

    if (Number.isFinite(context.pages) && context.pages > 0) {
        add('length', context.pages <= 2, { weight: 5, step: 5, params: { pages: context.pages } });
    }

    if (!isCoverLetterEmpty(project.coverLetter)) {
        const letter = project.coverLetter;
        add('letterDetails', t(letter.company) && t(letter.salutation), { level: 'tip', weight: 3, step: 4 });
    }

    const total = checks.reduce((sum, c) => sum + c.weight, 0);
    const earned = checks.filter((c) => c.ok).reduce((sum, c) => sum + c.weight, 0);
    const score = total ? Math.round((earned / total) * 100) : 0;
    const order = { error: 0, warn: 1, tip: 2 };
    const issues = checks.filter((c) => !c.ok).sort((a, b) => order[a.level] - order[b.level] || b.weight - a.weight);

    return {
        score,
        grade: score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 50 ? 'fair' : 'weak',
        checks,
        issues,
        passed: checks.length - issues.length,
    };
}
