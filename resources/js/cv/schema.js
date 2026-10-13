/**
 * Project schema shared by the builder UI, the import validator, the
 * templates and the Node test scripts. Pure JavaScript: no DOM access here.
 */

export const FORMAT = 'krijo-cv/project';
export const SCHEMA_VERSION = 2;
export const FILE_EXTENSION = '.cv.json';

/** Where the optional QR code on the CV points to (empty string = no QR code). */
export const QR_TARGETS = ['', 'website', 'linkedin'];

/** Languages a CV document (and the UI) can be written in. */
export const LANGUAGES = ['sq', 'en', 'it', 'de', 'es'];
export const DEFAULT_LANGUAGE = 'sq';

export const LIMITS = {
    short: 120, // names, job titles, institutions
    line: 300, // single-line text such as URLs and locations
    date: 40, // free-text dates such as "03/2021" or "Verë 2020"
    summary: 3000,
    description: 6000,
    letter: 8000, // cover letter body
    entries: 40, // per repeated section
    skills: 80,
    customSections: 10,
    sectionTitle: 80,
    photoChars: 1_500_000, // processed photo as data URL
    photoSourceChars: 4_000_000, // downscaled original kept for re-cropping
    fileBytes: 12 * 1024 * 1024,
};

export const DEFAULT_ACCENT = '#C1121F';

export const ACCENT_PRESETS = [
    { value: '#C1121F', label: { sq: 'E kuqe', en: 'Red', it: 'Rosso', de: 'Rot', es: 'Rojo' } },
    { value: '#111827', label: { sq: 'E zezë', en: 'Black', it: 'Nero', de: 'Schwarz', es: 'Negro' } },
    { value: '#1D4ED8', label: { sq: 'Blu', en: 'Blue', it: 'Blu', de: 'Blau', es: 'Azul' } },
    { value: '#0F766E', label: { sq: 'Jeshile e errët', en: 'Dark green', it: 'Verde scuro', de: 'Dunkelgrün', es: 'Verde oscuro' } },
    { value: '#7C3AED', label: { sq: 'Vjollcë', en: 'Violet', it: 'Viola', de: 'Violett', es: 'Violeta' } },
    { value: '#B45309', label: { sq: 'Kafe e artë', en: 'Amber', it: 'Ambra', de: 'Bernstein', es: 'Ámbar' } },
    { value: '#475569', label: { sq: 'Gri', en: 'Grey', it: 'Grigio', de: 'Grau', es: 'Gris' } },
];

export const LANGUAGE_LEVELS = [
    { value: 'native', label: { sq: 'Gjuhë amtare', en: 'Native', it: 'Madrelingua', de: 'Muttersprache', es: 'Lengua materna' } },
    { value: 'c2', label: { sq: 'C2 – Zotërim i plotë', en: 'C2 – Proficient', it: 'C2 – Padronanza', de: 'C2 – Verhandlungssicher', es: 'C2 – Maestría' } },
    { value: 'c1', label: { sq: 'C1 – Avancuar', en: 'C1 – Advanced', it: 'C1 – Avanzato', de: 'C1 – Fließend', es: 'C1 – Avanzado' } },
    { value: 'b2', label: { sq: 'B2 – Mesatar i lartë', en: 'B2 – Upper intermediate', it: 'B2 – Intermedio superiore', de: 'B2 – Sehr gute Kenntnisse', es: 'B2 – Intermedio alto' } },
    { value: 'b1', label: { sq: 'B1 – Mesatar', en: 'B1 – Intermediate', it: 'B1 – Intermedio', de: 'B1 – Gute Kenntnisse', es: 'B1 – Intermedio' } },
    { value: 'a2', label: { sq: 'A2 – Fillestar i lartë', en: 'A2 – Elementary', it: 'A2 – Elementare', de: 'A2 – Grundkenntnisse', es: 'A2 – Básico' } },
    { value: 'a1', label: { sq: 'A1 – Fillestar', en: 'A1 – Beginner', it: 'A1 – Principiante', de: 'A1 – Anfänger', es: 'A1 – Principiante' } },
];

export const SKILL_LEVELS = [
    { value: '', label: { sq: 'Pa nivel', en: 'No level', it: 'Nessun livello', de: 'Ohne Niveau', es: 'Sin nivel' } },
    { value: 'basic', label: { sq: 'Bazë', en: 'Basic', it: 'Base', de: 'Grundkenntnisse', es: 'Básico' } },
    { value: 'intermediate', label: { sq: 'Mesatar', en: 'Intermediate', it: 'Intermedio', de: 'Gut', es: 'Intermedio' } },
    { value: 'advanced', label: { sq: 'Avancuar', en: 'Advanced', it: 'Avanzato', de: 'Sehr gut', es: 'Avanzado' } },
    { value: 'expert', label: { sq: 'Ekspert', en: 'Expert', it: 'Esperto', de: 'Experte', es: 'Experto' } },
];

export function normalizeLanguage(value) {
    return LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
}

function pickLabel(label, lang) {
    if (typeof label === 'string') return label;
    return label[normalizeLanguage(lang)] ?? label[DEFAULT_LANGUAGE] ?? '';
}

export function languageLevelLabel(value, lang = DEFAULT_LANGUAGE) {
    const level = LANGUAGE_LEVELS.find((l) => l.value === value);
    return level ? pickLabel(level.label, lang) : '';
}

export function skillLevelLabel(value, lang = DEFAULT_LANGUAGE) {
    const level = SKILL_LEVELS.find((l) => l.value === value);
    return level ? pickLabel(level.label, lang) : '';
}

export function accentLabel(preset, lang = DEFAULT_LANGUAGE) {
    return pickLabel(preset.label, lang);
}

/** Field definitions per repeated section: name → { type, max } */
const S = (max = LIMITS.short) => ({ type: 'string', max });
const B = () => ({ type: 'boolean' });

export const ENTRY_FIELDS = {
    experience: {
        title: S(),
        employer: S(),
        location: S(LIMITS.line),
        startDate: S(LIMITS.date),
        endDate: S(LIMITS.date),
        current: B(),
        description: S(LIMITS.description),
    },
    education: {
        institution: S(),
        field: S(),
        qualification: S(),
        location: S(LIMITS.line),
        startDate: S(LIMITS.date),
        endDate: S(LIMITS.date),
        current: B(),
        description: S(LIMITS.description),
    },
    skills: {
        name: S(),
        level: S(20),
        group: S(),
    },
    languages: {
        name: S(),
        level: S(20),
    },
    certifications: {
        name: S(),
        issuer: S(),
        date: S(LIMITS.date),
        url: S(LIMITS.line),
    },
    projects: {
        name: S(),
        role: S(),
        url: S(LIMITS.line),
        date: S(LIMITS.date),
        technologies: S(LIMITS.line),
        description: S(LIMITS.description),
    },
    volunteer: {
        role: S(),
        organization: S(),
        location: S(LIMITS.line),
        startDate: S(LIMITS.date),
        endDate: S(LIMITS.date),
        current: B(),
        description: S(LIMITS.description),
    },
    publications: {
        title: S(LIMITS.line),
        publisher: S(),
        date: S(LIMITS.date),
        url: S(LIMITS.line),
        description: S(LIMITS.description),
    },
    references: {
        name: S(),
        position: S(),
        company: S(),
        email: S(LIMITS.line),
        phone: S(60),
    },
    custom: {
        title: S(),
        subtitle: S(),
        date: S(LIMITS.date),
        description: S(LIMITS.description),
    },
};

export const PERSONAL_FIELDS = {
    firstName: S(60),
    lastName: S(60),
    title: S(),
    email: S(LIMITS.line),
    phone: S(60),
    city: S(80),
    country: S(80),
    linkedin: S(LIMITS.line),
    website: S(LIMITS.line),
};

/** Optional cover letter stored with the project. */
export const COVER_LETTER_FIELDS = {
    recipientName: S(),
    recipientTitle: S(),
    company: S(),
    address: S(LIMITS.line),
    city: S(80),
    date: S(LIMITS.date),
    subject: S(LIMITS.line),
    salutation: S(LIMITS.line),
    body: S(LIMITS.letter),
    closing: S(LIMITS.line),
};

/** Section headings in every supported CV language. */
export const SECTION_TITLES = {
    sq: {
        summary: 'Përmbledhje profesionale',
        experience: 'Përvoja e punës',
        education: 'Arsimi',
        skills: 'Aftësitë',
        languages: 'Gjuhët',
        certifications: 'Certifikimet',
        projects: 'Projektet',
        volunteer: 'Përvoja vullnetare',
        publications: 'Publikimet',
        references: 'Referencat',
    },
    en: {
        summary: 'Professional summary',
        experience: 'Work experience',
        education: 'Education',
        skills: 'Skills',
        languages: 'Languages',
        certifications: 'Certifications',
        projects: 'Projects',
        volunteer: 'Volunteer experience',
        publications: 'Publications',
        references: 'References',
    },
    de: {
        summary: 'Profil',
        experience: 'Berufserfahrung',
        education: 'Ausbildung',
        skills: 'Fähigkeiten',
        languages: 'Sprachen',
        certifications: 'Zertifikate',
        projects: 'Projekte',
        volunteer: 'Ehrenamt',
        publications: 'Publikationen',
        references: 'Referenzen',
    },
    es: {
        summary: 'Perfil profesional',
        experience: 'Experiencia laboral',
        education: 'Formación académica',
        skills: 'Habilidades',
        languages: 'Idiomas',
        certifications: 'Certificaciones',
        projects: 'Proyectos',
        volunteer: 'Voluntariado',
        publications: 'Publicaciones',
        references: 'Referencias',
    },
    it: {
        summary: 'Profilo professionale',
        experience: 'Esperienza lavorativa',
        education: 'Istruzione e formazione',
        skills: 'Competenze',
        languages: 'Lingue',
        certifications: 'Certificazioni',
        projects: 'Progetti',
        volunteer: 'Volontariato',
        publications: 'Pubblicazioni',
        references: 'Referenze',
    },
};

/** Section metadata: the kind of content (headings come from SECTION_TITLES). */
export const SECTIONS = {
    summary: { kind: 'text' },
    experience: { kind: 'entries' },
    education: { kind: 'entries' },
    skills: { kind: 'tags' },
    languages: { kind: 'tags' },
    certifications: { kind: 'entries' },
    projects: { kind: 'entries' },
    volunteer: { kind: 'entries' },
    publications: { kind: 'entries' },
    references: { kind: 'entries' },
};

export const SECTION_KEYS = Object.keys(SECTIONS);
export const REPEATED_SECTION_KEYS = SECTION_KEYS.filter((k) => k !== 'summary');
export const DEFAULT_SECTION_ORDER = [...SECTION_KEYS];

export function sectionTitle(key, lang = DEFAULT_LANGUAGE) {
    const titles = SECTION_TITLES[normalizeLanguage(lang)] ?? SECTION_TITLES.sq;
    return titles[key] ?? SECTION_TITLES.sq[key] ?? key;
}

export function uid() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    const random = globalThis.crypto?.getRandomValues
        ? globalThis.crypto.getRandomValues(new Uint8Array(10))
        : Array.from({ length: 10 }, () => Math.floor(Math.random() * 256));
    for (const n of random) {
        id += alphabet[n % alphabet.length];
    }
    return id;
}

export function newEntry(section) {
    const fields = ENTRY_FIELDS[section];
    if (!fields) {
        throw new Error(`Unknown section: ${section}`);
    }
    const entry = { id: uid() };
    for (const [name, def] of Object.entries(fields)) {
        entry[name] = def.type === 'boolean' ? false : '';
    }
    return entry;
}

export function newCustomSection(title = '') {
    return { id: uid(), title, entries: [] };
}

export function emptyPersonal() {
    const personal = {};
    for (const name of Object.keys(PERSONAL_FIELDS)) {
        personal[name] = '';
    }
    return personal;
}

export function emptyCoverLetter() {
    const letter = {};
    for (const name of Object.keys(COVER_LETTER_FIELDS)) {
        letter[name] = '';
    }
    return letter;
}

export function isCoverLetterEmpty(letter) {
    return !letter || (letter.body ?? '').trim() === '';
}

export function emptyProject({ templateId = 'minimal', accentColor = DEFAULT_ACCENT, language = DEFAULT_LANGUAGE } = {}) {
    return {
        format: FORMAT,
        schemaVersion: SCHEMA_VERSION,
        exportedAt: null,
        cv: {
            personal: emptyPersonal(),
            summary: '',
            experience: [],
            education: [],
            skills: [],
            languages: [],
            certifications: [],
            projects: [],
            volunteer: [],
            publications: [],
            references: [],
            custom: [],
        },
        coverLetter: emptyCoverLetter(),
        photo: null,
        design: {
            templateId,
            accentColor,
            language: normalizeLanguage(language),
            showPhoto: true,
            qrTarget: '',
            sectionOrder: [...DEFAULT_SECTION_ORDER],
        },
    };
}

/** Deep clone that only keeps plain JSON-compatible data. */
export function cloneProject(project) {
    return JSON.parse(JSON.stringify(project));
}

/**
 * Returns a copy of the section order containing every built-in section once
 * and every existing custom section ("custom:<id>") once, dropping stale keys.
 */
export function normalizeSectionOrder(order, customSections) {
    const customKeys = (customSections ?? []).map((s) => `custom:${s.id}`);
    const valid = new Set([...SECTION_KEYS, ...customKeys]);
    const result = [];
    for (const key of Array.isArray(order) ? order : []) {
        if (typeof key === 'string' && valid.has(key) && !result.includes(key)) {
            result.push(key);
        }
    }
    for (const key of [...SECTION_KEYS, ...customKeys]) {
        if (!result.includes(key)) {
            result.push(key);
        }
    }
    return result;
}

/** An entry is empty when every text field is blank. */
export function isEntryEmpty(entry) {
    if (!entry || typeof entry !== 'object') {
        return true;
    }
    return !Object.entries(entry).some(
        ([key, value]) => key !== 'id' && typeof value === 'string' && value.trim() !== '',
    );
}

export function fullName(project) {
    const p = project.cv.personal;
    return [p.firstName, p.lastName].map((s) => (s ?? '').trim()).filter(Boolean).join(' ');
}

/**
 * CV_Firstname_Lastname.pdf style file name part. Letters (including ë and ç)
 * and digits are kept; anything else becomes a hyphen so the name is safe on
 * every operating system.
 */
export function fileNamePart(project) {
    const p = project.cv.personal;
    const clean = (s) =>
        (s ?? '')
            .normalize('NFC')
            .replace(/[^\p{L}\p{N}]+/gu, '-')
            .replace(/^-+|-+$/g, '');
    const parts = [clean(p.firstName), clean(p.lastName)].filter(Boolean);
    return parts.length ? parts.join('_') : 'CV';
}

/** File name prefix of the cover letter PDF per language. */
export function letterFilePrefix(lang = DEFAULT_LANGUAGE) {
    return { sq: 'Leter_Motivimi', en: 'Cover_Letter', it: 'Lettera_Motivazionale', de: 'Anschreiben', es: 'Carta_de_presentacion' }[normalizeLanguage(lang)];
}
