/**
 * Validation of imported project files. Everything is treated as data: strings
 * are kept as plain text, unknown keys are dropped, identifiers are regenerated
 * and nothing from the file is ever interpreted as HTML or code.
 *
 * validateProject() is synchronous and pure (usable in Node tests); messages
 * are returned in the requested language (sq, en or it).
 * verifyPhoto() additionally decodes the embedded image in the browser.
 */
import {
    COVER_LETTER_FIELDS,
    DEFAULT_ACCENT,
    ENTRY_FIELDS,
    FORMAT,
    LIMITS,
    PERSONAL_FIELDS,
    QR_TARGETS,
    SCHEMA_VERSION,
    SECTION_KEYS,
    emptyProject,
    normalizeLanguage,
    normalizeSectionOrder,
    uid,
} from './schema.js';

const IMAGE_DATA_URL = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
const SLUG = /^[a-z0-9-]{1,40}$/;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Names of the project parts used inside error messages. */
export const SECTION_LABELS = {
    sq: {
        personal: 'Të dhënat personale',
        summary: 'Përmbledhja',
        experience: 'Përvoja e punës',
        education: 'Arsimi',
        skills: 'Aftësitë',
        languages: 'Gjuhët',
        certifications: 'Certifikimet',
        projects: 'Projektet',
        volunteer: 'Përvoja vullnetare',
        publications: 'Publikimet',
        references: 'Referencat',
        custom: 'Seksionet e personalizuara',
        coverLetter: 'Letra e motivimit',
        design: 'Dizajni',
        photo: 'Fotoja',
    },
    en: {
        personal: 'Personal details',
        summary: 'Summary',
        experience: 'Work experience',
        education: 'Education',
        skills: 'Skills',
        languages: 'Languages',
        certifications: 'Certifications',
        projects: 'Projects',
        volunteer: 'Volunteer experience',
        publications: 'Publications',
        references: 'References',
        custom: 'Custom sections',
        coverLetter: 'Cover letter',
        design: 'Design',
        photo: 'Photo',
    },
    de: {
        personal: 'Persönliche Daten',
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
        custom: 'Eigene Abschnitte',
        coverLetter: 'Anschreiben',
        design: 'Design',
        photo: 'Foto',
    },
    es: {
        personal: 'Datos personales',
        summary: 'Perfil',
        experience: 'Experiencia laboral',
        education: 'Formación',
        skills: 'Habilidades',
        languages: 'Idiomas',
        certifications: 'Certificaciones',
        projects: 'Proyectos',
        volunteer: 'Voluntariado',
        publications: 'Publicaciones',
        references: 'Referencias',
        custom: 'Secciones personalizadas',
        coverLetter: 'Carta de presentación',
        design: 'Diseño',
        photo: 'Foto',
    },
    it: {
        personal: 'Dati personali',
        summary: 'Profilo',
        experience: 'Esperienza lavorativa',
        education: 'Formazione',
        skills: 'Competenze',
        languages: 'Lingue',
        certifications: 'Certificazioni',
        projects: 'Progetti',
        volunteer: 'Volontariato',
        publications: 'Pubblicazioni',
        references: 'Referenze',
        custom: 'Sezioni personalizzate',
        coverLetter: 'Lettera di presentazione',
        design: 'Design',
        photo: 'Foto',
    },
};

const MESSAGES = {
    sq: {
        notProject: 'Skedari nuk përmban një projekt të Krijo CV.',
        wrongFormat: 'Ky skedar nuk është një projekt i Krijo CV (formati nuk njihet).',
        badVersion: 'Versioni i skedarit mungon ose është i pavlefshëm.',
        newerVersion: 'Ky projekt është krijuar me një version më të ri të Krijo CV (versioni {v}). Përditëso faqen dhe provo sërish.',
        noCv: 'Skedari nuk përmban të dhënat e CV-së.',
        fieldMissing: '{where}: fusha „{key}” mungon.',
        fieldNotString: '{where}: fusha „{key}” duhet të jetë tekst.',
        fieldTooLong: '{where}: fusha „{key}” është më e gjatë se {max} shkronja.',
        fieldNotBool: '{where}: fusha „{key}” duhet të jetë po/jo.',
        notList: '{where}: duhet të jetë një listë.',
        tooMany: '{where}: më shumë se {max} hyrje nuk lejohen.',
        badEntry: '{where}: hyrja {n} nuk është e vlefshme.',
        photoFormat: '{where}: formati i fotos nuk njihet.',
        photoInvalid: '{where}: fotoja e ngulitur nuk është një imazh JPEG, PNG ose WebP i vlefshëm.',
        photoTooBig: '{where}: fotoja e ngulitur është shumë e madhe.',
        photoSourceInvalid: '{where}: imazhi origjinal i ngulitur nuk është i vlefshëm.',
        photoSourceTooBig: '{where}: imazhi origjinal i ngulitur është shumë i madh.',
        customTooMany: '{where}: më shumë se {max} seksione nuk lejohen.',
        customBad: '{where}: seksioni {n} nuk është i vlefshëm.',
        letterFormat: '{where}: formati nuk është i vlefshëm.',
        damaged: 'Skedari është i dëmtuar dhe nuk mund të lexohet.',
        invalidJson: 'Skedari nuk është një skedar JSON i vlefshëm. Sigurohu që po importon një skedar .cv.json të ruajtur nga Krijo CV.',
    },
    en: {
        notProject: 'The file does not contain a Krijo CV project.',
        wrongFormat: 'This file is not a Krijo CV project (unknown format).',
        badVersion: 'The file version is missing or invalid.',
        newerVersion: 'This project was created with a newer version of Krijo CV (version {v}). Refresh the page and try again.',
        noCv: 'The file does not contain the CV data.',
        fieldMissing: '{where}: the field “{key}” is missing.',
        fieldNotString: '{where}: the field “{key}” must be text.',
        fieldTooLong: '{where}: the field “{key}” is longer than {max} characters.',
        fieldNotBool: '{where}: the field “{key}” must be yes/no.',
        notList: '{where}: must be a list.',
        tooMany: '{where}: more than {max} entries are not allowed.',
        badEntry: '{where}: entry {n} is not valid.',
        photoFormat: '{where}: the photo format is not recognised.',
        photoInvalid: '{where}: the embedded photo is not a valid JPEG, PNG or WebP image.',
        photoTooBig: '{where}: the embedded photo is too large.',
        photoSourceInvalid: '{where}: the embedded original image is not valid.',
        photoSourceTooBig: '{where}: the embedded original image is too large.',
        customTooMany: '{where}: more than {max} sections are not allowed.',
        customBad: '{where}: section {n} is not valid.',
        letterFormat: '{where}: the format is not valid.',
        damaged: 'The file is damaged and cannot be read.',
        invalidJson: 'The file is not a valid JSON file. Make sure you are importing a .cv.json file saved from Krijo CV.',
    },
    de: {
        notProject: 'Die Datei enthält kein Krijo-CV-Projekt.',
        wrongFormat: 'Diese Datei ist kein Krijo-CV-Projekt (unbekanntes Format).',
        badVersion: 'Die Dateiversion fehlt oder ist ungültig.',
        newerVersion: 'Dieses Projekt wurde mit einer neueren Version von Krijo CV erstellt (Version {v}). Aktualisiere die Seite und versuche es erneut.',
        noCv: 'Die Datei enthält keine Lebenslaufdaten.',
        fieldMissing: '{where}: Das Feld „{key}“ fehlt.',
        fieldNotString: '{where}: Das Feld „{key}“ muss Text sein.',
        fieldTooLong: '{where}: Das Feld „{key}“ ist länger als {max} Zeichen.',
        fieldNotBool: '{where}: Das Feld „{key}“ muss Ja/Nein sein.',
        notList: '{where}: muss eine Liste sein.',
        tooMany: '{where}: Mehr als {max} Einträge sind nicht erlaubt.',
        badEntry: '{where}: Eintrag {n} ist ungültig.',
        photoFormat: '{where}: Das Fotoformat wird nicht erkannt.',
        photoInvalid: '{where}: Das eingebettete Foto ist kein gültiges JPEG-, PNG- oder WebP-Bild.',
        photoTooBig: '{where}: Das eingebettete Foto ist zu groß.',
        photoSourceInvalid: '{where}: Das eingebettete Originalbild ist ungültig.',
        photoSourceTooBig: '{where}: Das eingebettete Originalbild ist zu groß.',
        customTooMany: '{where}: Mehr als {max} Abschnitte sind nicht erlaubt.',
        customBad: '{where}: Abschnitt {n} ist ungültig.',
        letterFormat: '{where}: Das Format ist ungültig.',
        damaged: 'Die Datei ist beschädigt und kann nicht gelesen werden.',
        invalidJson: 'Die Datei ist keine gültige JSON-Datei. Stelle sicher, dass du eine mit Krijo CV gespeicherte .cv.json-Datei importierst.',
    },
    es: {
        notProject: 'El archivo no contiene un proyecto de Krijo CV.',
        wrongFormat: 'Este archivo no es un proyecto de Krijo CV (formato desconocido).',
        badVersion: 'La versión del archivo falta o no es válida.',
        newerVersion: 'Este proyecto se creó con una versión más reciente de Krijo CV (versión {v}). Actualiza la página e inténtalo de nuevo.',
        noCv: 'El archivo no contiene los datos del CV.',
        fieldMissing: '{where}: falta el campo «{key}».',
        fieldNotString: '{where}: el campo «{key}» debe ser texto.',
        fieldTooLong: '{where}: el campo «{key}» supera los {max} caracteres.',
        fieldNotBool: '{where}: el campo «{key}» debe ser sí/no.',
        notList: '{where}: debe ser una lista.',
        tooMany: '{where}: no se permiten más de {max} entradas.',
        badEntry: '{where}: la entrada {n} no es válida.',
        photoFormat: '{where}: no se reconoce el formato de la foto.',
        photoInvalid: '{where}: la foto incrustada no es una imagen JPEG, PNG o WebP válida.',
        photoTooBig: '{where}: la foto incrustada es demasiado grande.',
        photoSourceInvalid: '{where}: la imagen original incrustada no es válida.',
        photoSourceTooBig: '{where}: la imagen original incrustada es demasiado grande.',
        customTooMany: '{where}: no se permiten más de {max} secciones.',
        customBad: '{where}: la sección {n} no es válida.',
        letterFormat: '{where}: el formato no es válido.',
        damaged: 'El archivo está dañado y no se puede leer.',
        invalidJson: 'El archivo no es un JSON válido. Asegúrate de importar un archivo .cv.json guardado desde Krijo CV.',
    },
    it: {
        notProject: 'Il file non contiene un progetto di Krijo CV.',
        wrongFormat: 'Questo file non è un progetto di Krijo CV (formato sconosciuto).',
        badVersion: 'La versione del file manca o non è valida.',
        newerVersion: 'Questo progetto è stato creato con una versione più recente di Krijo CV (versione {v}). Aggiorna la pagina e riprova.',
        noCv: 'Il file non contiene i dati del CV.',
        fieldMissing: '{where}: il campo “{key}” manca.',
        fieldNotString: '{where}: il campo “{key}” deve essere testo.',
        fieldTooLong: '{where}: il campo “{key}” è più lungo di {max} caratteri.',
        fieldNotBool: '{where}: il campo “{key}” deve essere sì/no.',
        notList: '{where}: deve essere un elenco.',
        tooMany: '{where}: non sono ammesse più di {max} voci.',
        badEntry: '{where}: la voce {n} non è valida.',
        photoFormat: '{where}: il formato della foto non è riconosciuto.',
        photoInvalid: '{where}: la foto incorporata non è un’immagine JPEG, PNG o WebP valida.',
        photoTooBig: '{where}: la foto incorporata è troppo grande.',
        photoSourceInvalid: '{where}: l’immagine originale incorporata non è valida.',
        photoSourceTooBig: '{where}: l’immagine originale incorporata è troppo grande.',
        customTooMany: '{where}: non sono ammesse più di {max} sezioni.',
        customBad: '{where}: la sezione {n} non è valida.',
        letterFormat: '{where}: il formato non è valido.',
        damaged: 'Il file è danneggiato e non può essere letto.',
        invalidJson: 'Il file non è un file JSON valido. Assicurati di importare un file .cv.json salvato da Krijo CV.',
    },
};

let lang = 'sq';

function labels() {
    return SECTION_LABELS[lang] ?? SECTION_LABELS.sq;
}

function format(code, params = {}) {
    const template = (MESSAGES[lang] ?? MESSAGES.sq)[code] ?? MESSAGES.sq[code] ?? code;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
}

class ValidationError extends Error {}

function fail(code, params) {
    throw new ValidationError(format(code, params));
}

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Removes control characters except newline and tab. */
function cleanText(value) {
    // eslint-disable-next-line no-control-regex
    return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

function readString(container, key, max, where, { required = false } = {}) {
    const value = container[key];
    if (value === undefined || value === null) {
        if (required) {
            fail('fieldMissing', { where, key });
        }
        return '';
    }
    if (typeof value !== 'string') {
        fail('fieldNotString', { where, key });
    }
    if (value.length > max) {
        fail('fieldTooLong', { where, key, max });
    }
    return cleanText(value);
}

function readBoolean(container, key, where) {
    const value = container[key];
    if (value === undefined || value === null) {
        return false;
    }
    if (typeof value !== 'boolean') {
        fail('fieldNotBool', { where, key });
    }
    return value;
}

function readEntries(raw, section, max, where) {
    if (raw === undefined || raw === null) {
        return [];
    }
    if (!Array.isArray(raw)) {
        fail('notList', { where });
    }
    if (raw.length > max) {
        fail('tooMany', { where, max });
    }
    const fields = ENTRY_FIELDS[section];
    return raw.map((item, index) => {
        if (!isPlainObject(item)) {
            fail('badEntry', { where, n: index + 1 });
        }
        const entry = { id: uid() };
        const entryWhere = `${where} #${index + 1}`;
        for (const [name, def] of Object.entries(fields)) {
            entry[name] =
                def.type === 'boolean' ? readBoolean(item, name, entryWhere) : readString(item, name, def.max, entryWhere);
        }
        return entry;
    });
}

function readPhoto(raw) {
    if (raw === undefined || raw === null) {
        return null;
    }
    const where = labels().photo;
    if (!isPlainObject(raw)) {
        fail('photoFormat', { where });
    }
    if (typeof raw.data !== 'string' || !IMAGE_DATA_URL.test(raw.data)) {
        fail('photoInvalid', { where });
    }
    if (raw.data.length > LIMITS.photoChars) {
        fail('photoTooBig', { where });
    }
    let source = null;
    if (raw.source !== undefined && raw.source !== null) {
        if (typeof raw.source !== 'string' || !IMAGE_DATA_URL.test(raw.source)) {
            fail('photoSourceInvalid', { where });
        }
        if (raw.source.length > LIMITS.photoSourceChars) {
            fail('photoSourceTooBig', { where });
        }
        source = raw.source;
    }
    let crop = null;
    if (isPlainObject(raw.crop)) {
        const zoom = Number(raw.crop.zoom);
        const ox = Number(raw.crop.ox);
        const oy = Number(raw.crop.oy);
        if ([zoom, ox, oy].every((n) => Number.isFinite(n)) && zoom >= 1 && zoom <= 8) {
            crop = { zoom, ox, oy };
        }
    }
    return { data: raw.data, source, crop };
}

/**
 * @param {unknown} raw Parsed JSON
 * @param {string} [language] language of the returned error messages
 * @returns {{ ok: true, project: object } | { ok: false, error: string }}
 */
export function validateProject(raw, language = 'sq') {
    lang = normalizeLanguage(language);
    const names = labels();

    try {
        if (!isPlainObject(raw)) {
            fail('notProject');
        }
        if (raw.format !== FORMAT) {
            fail('wrongFormat');
        }
        const version = raw.schemaVersion;
        if (!Number.isInteger(version) || version < 1) {
            fail('badVersion');
        }
        if (version > SCHEMA_VERSION) {
            fail('newerVersion', { v: version });
        }
        if (!isPlainObject(raw.cv)) {
            fail('noCv');
        }

        const project = emptyProject();
        const cv = raw.cv;

        const personal = isPlainObject(cv.personal) ? cv.personal : {};
        for (const [name, def] of Object.entries(PERSONAL_FIELDS)) {
            project.cv.personal[name] = readString(personal, name, def.max, names.personal);
        }

        project.cv.summary = readString(cv, 'summary', LIMITS.summary, names.summary);

        for (const section of SECTION_KEYS) {
            if (section === 'summary') {
                continue;
            }
            const max = section === 'skills' ? LIMITS.skills : LIMITS.entries;
            project.cv[section] = readEntries(cv[section], section, max, names[section]);
        }

        const customRaw = cv.custom === undefined || cv.custom === null ? [] : cv.custom;
        if (!Array.isArray(customRaw)) {
            fail('notList', { where: names.custom });
        }
        if (customRaw.length > LIMITS.customSections) {
            fail('customTooMany', { where: names.custom, max: LIMITS.customSections });
        }
        const customIdMap = new Map();
        project.cv.custom = customRaw.map((section, index) => {
            if (!isPlainObject(section)) {
                fail('customBad', { where: names.custom, n: index + 1 });
            }
            const id = uid();
            if (typeof section.id === 'string') {
                customIdMap.set(`custom:${section.id}`, `custom:${id}`);
            }
            const where = `${names.custom} #${index + 1}`;
            return {
                id,
                title: readString(section, 'title', LIMITS.sectionTitle, where),
                entries: readEntries(section.entries, 'custom', LIMITS.entries, where),
            };
        });

        project.photo = readPhoto(raw.photo);

        const letterRaw = raw.coverLetter === undefined || raw.coverLetter === null ? {} : raw.coverLetter;
        if (!isPlainObject(letterRaw)) {
            fail('letterFormat', { where: names.coverLetter });
        }
        for (const [name, def] of Object.entries(COVER_LETTER_FIELDS)) {
            project.coverLetter[name] = readString(letterRaw, name, def.max, names.coverLetter);
        }

        const design = isPlainObject(raw.design) ? raw.design : {};
        const templateId = typeof design.templateId === 'string' && SLUG.test(design.templateId) ? design.templateId : 'minimal';
        const accentColor =
            typeof design.accentColor === 'string' && HEX_COLOR.test(design.accentColor)
                ? design.accentColor.toUpperCase()
                : DEFAULT_ACCENT;
        const showPhoto = typeof design.showPhoto === 'boolean' ? design.showPhoto : true;
        const order = Array.isArray(design.sectionOrder)
            ? design.sectionOrder.map((key) => (typeof key === 'string' && customIdMap.has(key) ? customIdMap.get(key) : key))
            : [];

        project.design = {
            templateId,
            accentColor,
            language: normalizeLanguage(design.language),
            showPhoto,
            qrTarget: QR_TARGETS.includes(design.qrTarget) ? design.qrTarget : '',
            sectionOrder: normalizeSectionOrder(order, project.cv.custom),
        };

        return { ok: true, project };
    } catch (error) {
        if (error instanceof ValidationError) {
            return { ok: false, error: error.message };
        }
        return { ok: false, error: format('damaged') };
    }
}

/**
 * Parses the raw text of an uploaded file. Separated from validateProject so
 * that JSON errors get their own message.
 */
export function parseProjectText(text, language = 'sq') {
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        lang = normalizeLanguage(language);
        return { ok: false, error: format('invalidJson') };
    }
    return validateProject(data, language);
}

/** Browser-only: decodes a data URL to make sure it is a real image. */
export function verifyImage(dataUrl) {
    return new Promise((resolve) => {
        if (typeof Image === 'undefined') {
            resolve(true);
            return;
        }
        const img = new Image();
        img.onload = () => resolve(img.naturalWidth > 0 && img.naturalHeight > 0);
        img.onerror = () => resolve(false);
        img.src = dataUrl;
    });
}

export async function verifyPhoto(photo) {
    if (!photo) {
        return true;
    }
    if (!(await verifyImage(photo.data))) {
        return false;
    }
    if (photo.source && !(await verifyImage(photo.source))) {
        return false;
    }
    return true;
}
