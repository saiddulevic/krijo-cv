/**
 * Shared building blocks for the pdfmake templates. Pure JavaScript (no DOM)
 * so the same code runs in the browser and in the Node test/thumbnail scripts.
 */
import { DEFAULT_LANGUAGE, SECTIONS, isEntryEmpty, languageLevelLabel, normalizeLanguage, sectionTitle, skillLevelLabel, uid } from '../schema.js';

export const PAGE = { width: 595.28, height: 841.89 }; // A4 in points
export const FONT_SANS = 'Inter';
export const FONT_SERIF = 'PTSerif';
export const INK = '#111827';
export const MUTED = '#6B7280';
export const LINE = '#E5E7EB';
export const SOFT = '#F3F4F6';
export const PLACEHOLDER = '#9CA3AF';

/** Fixed labels used inside the documents, per CV language. */
export const LABELS = {
    sq: {
        present: 'Aktualisht',
        contact: 'Kontakt',
        personal: 'Të dhënat personale',
        technologies: 'Teknologjitë',
        email: 'Email',
        phone: 'Telefon',
        location: 'Vendndodhja',
        linkedin: 'LinkedIn',
        website: 'Web',
        placeholderName: 'Emri Mbiemri',
        internships: 'Praktika dhe përvoja e punës',
        coverLetter: 'Letër motivimi',
        qrWebsite: 'Skano për portofolin',
        qrLinkedin: 'Skano për profilin LinkedIn',
        subject: 'Lënda',
        sincerely: 'Me respekt,',
    },
    en: {
        present: 'Present',
        contact: 'Contact',
        personal: 'Personal details',
        technologies: 'Technologies',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        linkedin: 'LinkedIn',
        website: 'Web',
        placeholderName: 'First Last',
        internships: 'Internships and work experience',
        coverLetter: 'Cover letter',
        qrWebsite: 'Scan to see my portfolio',
        qrLinkedin: 'Scan to see my LinkedIn profile',
        subject: 'Subject',
        sincerely: 'Yours sincerely,',
    },
    de: {
        present: 'heute',
        contact: 'Kontakt',
        personal: 'Persönliche Daten',
        technologies: 'Technologien',
        email: 'E-Mail',
        phone: 'Telefon',
        location: 'Wohnort',
        linkedin: 'LinkedIn',
        website: 'Web',
        placeholderName: 'Vorname Nachname',
        internships: 'Praktika und Berufserfahrung',
        coverLetter: 'Anschreiben',
        subject: '',
        sincerely: 'Mit freundlichen Grüßen',
        qrWebsite: 'Scannen für mein Portfolio',
        qrLinkedin: 'Scannen für mein LinkedIn-Profil',
    },
    es: {
        present: 'Actualidad',
        contact: 'Contacto',
        personal: 'Datos personales',
        technologies: 'Tecnologías',
        email: 'Email',
        phone: 'Teléfono',
        location: 'Ubicación',
        linkedin: 'LinkedIn',
        website: 'Web',
        placeholderName: 'Nombre Apellido',
        internships: 'Prácticas y experiencia laboral',
        coverLetter: 'Carta de presentación',
        subject: 'Asunto',
        sincerely: 'Atentamente,',
        qrWebsite: 'Escanea para ver mi portfolio',
        qrLinkedin: 'Escanea para ver mi perfil de LinkedIn',
    },
    it: {
        present: 'Presente',
        contact: 'Contatti',
        personal: 'Dati personali',
        technologies: 'Tecnologie',
        email: 'Email',
        phone: 'Telefono',
        location: 'Località',
        linkedin: 'LinkedIn',
        website: 'Web',
        placeholderName: 'Nome Cognome',
        internships: 'Tirocini ed esperienza lavorativa',
        coverLetter: 'Lettera di presentazione',
        qrWebsite: 'Scansiona per il portfolio',
        qrLinkedin: 'Scansiona per il profilo LinkedIn',
        subject: 'Oggetto',
        sincerely: 'Cordiali saluti,',
    },
};

let currentLocale = DEFAULT_LANGUAGE;

/** Sets the document language used by the label helpers (called by prepare()). */
export function setLocale(lang) {
    currentLocale = normalizeLanguage(lang);
    return currentLocale;
}

export function getLocale() {
    return currentLocale;
}

/** A fixed label in the current document language. */
export function L(key) {
    return LABELS[currentLocale]?.[key] ?? LABELS.sq[key] ?? key;
}

export function join(parts, separator = ', ') {
    return parts.map((p) => (p ?? '').toString().trim()).filter(Boolean).join(separator);
}

export function dateRange(entry) {
    const start = (entry.startDate ?? '').trim();
    const end = entry.current ? L('present') : (entry.endDate ?? '').trim();
    if (start && end) {
        return `${start} – ${end}`;
    }
    return start || end || '';
}

export function normalizeUrl(value) {
    const raw = (value ?? '').trim();
    if (!raw) {
        return null;
    }
    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }
    if (/^[a-z]+:/i.test(raw)) {
        return null; // other schemes are never turned into links
    }
    return `https://${raw}`;
}

/** Display text for a URL without scheme, "www." and trailing slash. */
export function displayUrl(value) {
    return (value ?? '')
        .trim()
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .replace(/\/+$/, '');
}

export function linkNode(value, style = {}) {
    const href = normalizeUrl(value);
    if (!href) {
        return (value ?? '').trim() ? { text: (value ?? '').trim(), ...style } : null;
    }
    return { text: displayUrl(value), link: href, ...style };
}

export function emailNode(value, style = {}) {
    const email = (value ?? '').trim();
    if (!email) {
        return null;
    }
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return valid ? { text: email, link: `mailto:${email}`, ...style } : { text: email, ...style };
}

export function phoneNode(value, style = {}) {
    const phone = (value ?? '').trim();
    if (!phone) {
        return null;
    }
    const digits = phone.replace(/[^\d+]/g, '');
    return digits.length >= 5 ? { text: phone, link: `tel:${digits}`, ...style } : { text: phone, ...style };
}

/**
 * Turns a multi-line description into pdfmake nodes: paragraphs, and bullet
 * lists for consecutive lines starting with "-", "•" or "*".
 */
export function textBlock(description, style = {}) {
    const lines = (description ?? '').replace(/\r\n?/g, '\n').split('\n');
    const nodes = [];
    let bullets = [];
    const flushBullets = () => {
        if (bullets.length) {
            nodes.push({ ul: bullets.map((b) => ({ text: b, ...style })), margin: [0, 1, 0, 1] });
            bullets = [];
        }
    };
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) {
            flushBullets();
            continue;
        }
        const bullet = line.match(/^[-•*]\s+(.*)$/);
        if (bullet) {
            bullets.push(bullet[1].trim());
        } else {
            flushBullets();
            nodes.push({ text: line, ...style, margin: [0, 1, 0, 1] });
        }
    }
    flushBullets();
    return nodes;
}

/* ------------------------------------------------------------------------ */
/* Keep-with-next                                                            */
/* ------------------------------------------------------------------------ */

const KEEP_PREFIX = 'kw';

function tagDescendants(node, prefix, counter) {
    if (Array.isArray(node)) {
        return node.map((child) => tagDescendants(child, prefix, counter));
    }
    if (typeof node === 'string') {
        counter.n += 1;
        return { text: node, id: `${prefix}-${counter.n}` };
    }
    if (!node || typeof node !== 'object') {
        return node;
    }
    counter.n += 1;
    const tagged = { ...node, id: `${prefix}-${counter.n}` };
    for (const key of ['stack', 'columns', 'ul', 'ol']) {
        if (Array.isArray(node[key])) {
            tagged[key] = tagDescendants(node[key], prefix, counter);
        }
    }
    if (node.table?.body) {
        tagged.table = {
            ...node.table,
            body: node.table.body.map((row) => row.map((cell) => tagDescendants(cell, prefix, counter))),
        };
    }
    return tagged;
}

/**
 * Marks a block (section heading, entry header…) so that pageBreakBefore()
 * moves it to the next page when nothing but the block itself would remain
 * below it on the current page. Every node inside gets an id with the "kw"
 * prefix. `columnWidth` (points) lets the rule ignore nodes of neighbouring
 * columns in multi-column layouts.
 */
export function keepWithNext(nodes, level = 1, extra = {}, columnWidth = null) {
    const width = Number.isFinite(columnWidth) && columnWidth > 0 ? `-w${Math.round(columnWidth)}` : '';
    const prefix = `${KEEP_PREFIX}-${uid()}${width}`;
    const counter = { n: 0 };
    return {
        stack: tagDescendants(Array.isArray(nodes) ? nodes : [nodes], prefix, counter),
        headlineLevel: level,
        id: prefix,
        ...extra,
    };
}

function keepColumnWidth(id) {
    const match = typeof id === 'string' ? id.match(/-w(\d+)(?:-\d+)?$/) : null;
    return match ? Number(match[1]) : null;
}

/**
 * pdfmake 0.3 page-break callback: a keep-with-next block starts a new page
 * when no ordinary content follows it (within its own column) on the page.
 */
export function pageBreakBefore(nodeInfo, context) {
    if (!nodeInfo.headlineLevel || typeof context?.getFollowingNodesOnPage !== 'function') {
        return false;
    }
    const following = context.getFollowingNodesOnPage();
    const width = keepColumnWidth(nodeInfo.id);
    const left = nodeInfo.startPosition?.left ?? 0;
    const top = nodeInfo.startPosition?.top ?? 0;
    return !following.some((node) => {
        if (typeof node.id === 'string' && node.id.startsWith(KEEP_PREFIX)) {
            return false;
        }
        if (width === null || !node.startPosition) {
            return true;
        }
        const position = node.startPosition;
        return position.left >= left - 2 && position.left < left + width - 2 && position.top >= top - 1;
    });
}

/* ------------------------------------------------------------------------ */

/** Normalised entry shape used by the generic renderers. */
export function entryShape(sectionKey, e) {
    switch (sectionKey) {
        case 'experience':
            return { primary: e.title, secondary: join([e.employer, e.location]), date: dateRange(e), body: e.description };
        case 'education':
            return { primary: join([e.qualification, e.field], ' – '), secondary: join([e.institution, e.location]), date: dateRange(e), body: e.description };
        case 'certifications':
            return { primary: e.name, secondary: e.issuer, date: e.date, link: e.url, body: '' };
        case 'projects':
            return { primary: e.name, secondary: join([e.role, e.technologies], ' · '), date: e.date, link: e.url, body: e.description };
        case 'volunteer':
            return { primary: e.role, secondary: join([e.organization, e.location]), date: dateRange(e), body: e.description };
        case 'publications':
            return { primary: e.title, secondary: e.publisher, date: e.date, link: e.url, body: e.description };
        case 'references':
            return { primary: e.name, secondary: join([e.position, e.company]), date: '', body: '', contact: { email: e.email, phone: e.phone } };
        default:
            return { primary: e.title, secondary: e.subtitle, date: e.date, body: e.description };
    }
}

/**
 * Builds the rendering context: trimmed data, non-empty sections in the
 * visitor's order, contact items and photo variants.
 *
 * @param {object} project
 * @param {{ square: string, round: string } | null} photos data URLs
 */
export function prepare(project, photos = null) {
    const cv = project.cv;
    const p = cv.personal;
    const t = (v) => (v ?? '').toString().trim();
    const locale = setLocale(project.design?.language);

    const name = join([p.firstName, p.lastName], ' ');
    const contacts = [];
    const email = emailNode(p.email);
    if (email) contacts.push({ kind: 'email', ...email });
    const phone = phoneNode(p.phone);
    if (phone) contacts.push({ kind: 'phone', ...phone });
    const location = join([p.city, p.country]);
    if (location) contacts.push({ kind: 'location', text: location });
    const linkedin = linkNode(p.linkedin);
    if (linkedin) contacts.push({ kind: 'linkedin', ...linkedin });
    const website = linkNode(p.website);
    if (website) contacts.push({ kind: 'website', ...website });

    const sections = [];
    const customById = new Map(cv.custom.map((s) => [`custom:${s.id}`, s]));
    for (const key of project.design.sectionOrder) {
        if (key === 'summary') {
            if (t(cv.summary)) {
                sections.push({ key, title: sectionTitle('summary', locale), kind: 'text', text: t(cv.summary) });
            }
            continue;
        }
        if (key.startsWith('custom:')) {
            const custom = customById.get(key);
            if (!custom) continue;
            const items = custom.entries.filter((e) => !isEntryEmpty(e));
            if (items.length && t(custom.title)) {
                sections.push({ key, title: t(custom.title), kind: 'entries', items, custom: true });
            }
            continue;
        }
        const meta = SECTIONS[key];
        if (!meta) continue;
        const items = (cv[key] ?? []).filter((e) => !isEntryEmpty(e));
        if (items.length) {
            sections.push({ key, title: sectionTitle(key, locale), kind: meta.kind, items });
        }
    }

    const ctx = {
        name,
        hasName: Boolean(name),
        title: t(p.title),
        contacts,
        location,
        locale,
        L,
        accent: project.design.accentColor,
        photo: project.design.showPhoto && photos && project.photo ? photos : null,
        sections,
        personal: p,
    };

    ctx.section = (key) => sections.find((s) => s.key === key) ?? null;
    ctx.without = (keys) => sections.filter((s) => !keys.includes(s.key));
    /** Sections in a preferred order; the rest follow in the visitor's order. */
    ctx.ordered = (preferred) => [
        ...preferred.map((k) => ctx.section(k)).filter(Boolean),
        ...sections.filter((s) => !preferred.includes(s.key)),
    ];
    ctx.entryShape = entryShape;
    return ctx;
}

/** Name text with a placeholder when the visitor has not typed one yet. */
export function nameText(ctx, style = {}) {
    return ctx.hasName ? { text: ctx.name, ...style } : { text: L('placeholderName'), ...style, color: PLACEHOLDER };
}

/**
 * Document skeleton shared by every template.
 */
export function baseDocument(ctx, { font = FONT_SANS, fontSize = 10, lineHeight = 1.25, margins = [44, 44, 44, 48] } = {}) {
    return {
        pageSize: 'A4',
        pageMargins: margins,
        info: {
            title: ctx.hasName ? `CV – ${ctx.name}` : 'CV',
            author: ctx.hasName ? ctx.name : undefined,
            subject: 'Curriculum Vitae',
            creator: 'Krijo CV',
            producer: 'Krijo CV',
        },
        defaultStyle: { font, fontSize, lineHeight, color: INK },
        pageBreakBefore,
        content: [],
        styles: {},
    };
}

export function contentWidth(margins) {
    return PAGE.width - margins[0] - margins[2];
}

/** Horizontal rule as a canvas line. */
export function rule(width, color = LINE, thickness = 0.75, margin = [0, 4, 0, 8]) {
    return {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: width, y2: 0, lineWidth: thickness, lineColor: color }],
        margin,
    };
}

/** Contact line "a · b · c" with clickable parts. */
export function contactInline(ctx, { color = MUTED, separator = '   ·   ', fontSize = 9 } = {}) {
    const parts = [];
    ctx.contacts.forEach((c, i) => {
        if (i > 0) parts.push({ text: separator, color });
        parts.push({ text: c.text, link: c.link, color });
    });
    return parts.length ? { text: parts, fontSize, color } : null;
}

/** Contact items stacked, one per line. */
export function contactStack(ctx, { color = INK, fontSize = 9, labels = false } = {}) {
    const names = { email: L('email'), phone: L('phone'), location: L('location'), linkedin: L('linkedin'), website: L('website') };
    return ctx.contacts.map((c) => ({
        text: labels ? [{ text: `${names[c.kind]}: `, color: MUTED }, { text: c.text, link: c.link, color }] : { text: c.text, link: c.link, color },
        fontSize,
        margin: [0, 0, 0, 3],
    }));
}

/**
 * Generic entry list renderer.
 * layout: 'stacked' (date under the title), 'dateRight' (date aligned right on
 * the title line) or 'dateLeft' (two columns with the date on the left).
 * Entry headers are kept with the first lines of their body; entries without
 * a body are kept in one piece.
 */
export function renderEntries(ctx, section, opts = {}) {
    const {
        layout = 'dateRight',
        titleStyle = { bold: true, fontSize: 10.5 },
        subStyle = { color: MUTED, fontSize: 9.5 },
        dateStyle = { color: MUTED, fontSize: 9 },
        bodyStyle = { fontSize: 9.5 },
        dateWidth = 92,
        gap = 7,
        accentTitle = false,
        columnWidth = null,
    } = opts;
    const nodes = [];
    section.items.forEach((item, index) => {
        const s = entryShape(section.custom ? 'custom' : section.key, item);
        const title = { text: s.primary || s.secondary || '', ...titleStyle, ...(accentTitle ? { color: ctx.accent } : {}) };
        const titleLine = s.link ? { ...title, link: normalizeUrl(s.link) ?? undefined } : title;
        const sub = s.primary && s.secondary ? { text: s.secondary, ...subStyle } : null;
        const body = [];
        if (s.body) body.push(...textBlock(s.body, bodyStyle));
        if (s.contact) {
            const parts = [emailNode(s.contact.email, bodyStyle), phoneNode(s.contact.phone, bodyStyle)].filter(Boolean);
            if (parts.length) {
                const text = [];
                parts.forEach((p, i) => {
                    if (i) text.push({ text: ' · ', ...bodyStyle });
                    text.push(p);
                });
                body.push({ text, margin: [0, 1, 0, 1] });
            }
        }
        const margin = [0, index === 0 ? 0 : gap, 0, 0];
        const header = (content) => (body.length ? keepWithNext(content, 2, {}, columnWidth) : { stack: content, unbreakable: true });

        if (layout === 'dateLeft') {
            nodes.push({
                columns: [
                    { width: dateWidth, text: s.date || '', ...dateStyle, margin: [0, 1, 0, 0] },
                    { width: '*', stack: [header([titleLine, ...(sub ? [sub] : [])]), ...body] },
                ],
                columnGap: 10,
                margin,
            });
        } else if (layout === 'dateRight') {
            nodes.push({
                stack: [
                    header([
                        {
                            columns: [
                                { width: '*', stack: [titleLine, ...(sub ? [sub] : [])] },
                                ...(s.date ? [{ width: 'auto', text: s.date, ...dateStyle, alignment: 'right', margin: [8, 1, 0, 0] }] : []),
                            ],
                        },
                    ]),
                    ...body,
                ],
                margin,
            });
        } else {
            nodes.push({
                stack: [header([titleLine, ...(sub ? [sub] : []), ...(s.date ? [{ text: s.date, ...dateStyle }] : [])]), ...body],
                margin,
            });
        }
    });
    return nodes;
}

export function skillLabel(item, { withLevel = true } = {}) {
    const level = withLevel ? skillLevelLabel(item.level, currentLocale) : '';
    return level ? `${item.name.trim()} (${level})` : item.name.trim();
}

export function languageLabel(item) {
    const level = languageLevelLabel(item.level, currentLocale);
    return level ? `${item.name.trim()} – ${level}` : item.name.trim();
}

/** Groups skills by their optional group label, keeping first-seen order. */
export function groupSkills(items) {
    const groups = new Map();
    for (const item of items) {
        const key = (item.group ?? '').trim() || '';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
    }
    return groups;
}

/** Skills as an inline comma-separated paragraph. */
export function skillsInline(items, style = {}) {
    return { text: items.map((i) => skillLabel(i)).join(', '), ...style };
}

/** Skills one per line. */
export function skillsList(items, style = {}) {
    return items.map((i) => ({ text: skillLabel(i), ...style, margin: [0, 0, 0, 2] }));
}

/** Skills grouped: "Group: a, b, c" lines (ungrouped first). */
export function skillsGrouped(items, { labelStyle = { bold: true }, style = {} } = {}) {
    const groups = groupSkills(items);
    const nodes = [];
    for (const [group, list] of groups) {
        const names = list.map((i) => skillLabel(i)).join(', ');
        nodes.push(
            group
                ? { text: [{ text: `${group}: `, ...labelStyle }, { text: names }], ...style, margin: [0, 0, 0, 3] }
                : { text: names, ...style, margin: [0, 0, 0, 3] },
        );
    }
    return nodes;
}

/** Skills in a compact grid of N columns (used by the creative template). */
export function skillsGrid(items, columns = 3, style = {}) {
    const rows = [];
    for (let i = 0; i < items.length; i += columns) {
        const row = [];
        for (let c = 0; c < columns; c += 1) {
            const item = items[i + c];
            row.push(item ? { text: skillLabel(item, { withLevel: false }), ...style, margin: [0, 2, 0, 2] } : { text: '' });
        }
        rows.push(row);
    }
    return {
        table: { widths: Array(columns).fill('*'), body: rows },
        layout: 'noBorders',
    };
}

/** Languages as "Name – Level" lines. */
export function languagesList(items, style = {}) {
    return items.map((i) => ({ text: languageLabel(i), ...style, margin: [0, 0, 0, 2] }));
}

export function languagesInline(items, style = {}) {
    return { text: items.map((i) => languageLabel(i)).join(', '), ...style };
}

/** Default body renderer for a section, used by simpler templates. */
export function sectionBody(ctx, section, opts = {}) {
    if (section.kind === 'text') {
        return textBlock(section.text, opts.bodyStyle ?? { fontSize: 9.5 });
    }
    if (section.key === 'skills') {
        return opts.skills ? opts.skills(section.items) : [skillsInline(section.items, opts.bodyStyle ?? { fontSize: 9.5 })];
    }
    if (section.key === 'languages') {
        return opts.languages ? opts.languages(section.items) : [languagesInline(section.items, opts.bodyStyle ?? { fontSize: 9.5 })];
    }
    return renderEntries(ctx, section, opts);
}

/** Photo node helpers. Width in points. */
export function photoSquare(ctx, width, extra = {}) {
    return ctx.photo ? { image: ctx.photo.square, width, height: width, ...extra } : null;
}

export function photoRound(ctx, width, extra = {}) {
    return ctx.photo ? { image: ctx.photo.round, width, height: width, ...extra } : null;
}

/* ------------------------------------------------------------------------ */
/* Colour helpers                                                            */
/* ------------------------------------------------------------------------ */

function hexToRgb(hex) {
    const clean = (hex ?? '').replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    const n = Number.parseInt(full, 16);
    if (!Number.isFinite(n) || full.length !== 6) return { r: 193, g: 18, b: 31 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }) {
    return `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

/** Mixes two hex colours; t is the weight of the second colour (0..1). */
export function mix(hexA, hexB, t) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    return rgbToHex({ r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t });
}

/** Very light version of a colour for backgrounds (default 90 % white). */
export function tint(hex, amount = 0.9) {
    return mix(hex, '#FFFFFF', amount);
}

/** Darker version of a colour. */
export function shade(hex, amount = 0.35) {
    return mix(hex, '#000000', amount);
}

/** White or dark ink, whichever reads better on the given background. */
export function readableOn(hex) {
    const { r, g, b } = hexToRgb(hex);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.6 ? INK : '#FFFFFF';
}

/** First letters of the first and last name, e.g. "AK". */
export function initials(ctx) {
    const parts = [ctx.personal.firstName, ctx.personal.lastName].map((s) => (s ?? '').trim()).filter(Boolean);
    const letters = parts.map((p) => p[0].toUpperCase()).join('');
    return letters || 'CV';
}

/* ------------------------------------------------------------------------ */
/* Icons (Heroicons outline, MIT) rendered as inline SVG                     */
/* ------------------------------------------------------------------------ */

const ICON_PATHS = {
    email: '<path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>',
    phone: '<path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>',
    location: '<path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>',
    linkedin: '<path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>',
    website: '<path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"/>',
};

export function iconSvg(kind, color = MUTED) {
    const paths = ICON_PATHS[kind] ?? ICON_PATHS.website;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

/** Contact lines with a small icon in front of each. */
export function contactIconRows(ctx, { color = INK, iconColor = MUTED, fontSize = 9, gap = 3, iconSize = 9 } = {}) {
    return ctx.contacts.map((c) => ({
        columns: [
            { width: iconSize + 2, svg: iconSvg(c.kind, iconColor), width: iconSize, height: iconSize, margin: [0, 1.5, 0, 0] },
            { width: '*', text: c.text, link: c.link, color, fontSize },
        ],
        columnGap: 4,
        margin: [0, 0, 0, gap],
    }));
}

/** Contacts on one line with icons, separated by spacing (for headers). */
export function contactIconInline(ctx, { color = MUTED, iconColor = MUTED, fontSize = 9, iconSize = 9 } = {}) {
    const columns = [];
    ctx.contacts.forEach((c) => {
        columns.push({ width: 'auto', svg: iconSvg(c.kind, iconColor), width: iconSize, height: iconSize, margin: [0, 1.5, 3, 0] });
        columns.push({ width: 'auto', text: c.text, link: c.link, color, fontSize, margin: [0, 0, 12, 0] });
    });
    return columns.length ? { columns, columnGap: 0 } : null;
}

/* ------------------------------------------------------------------------ */
/* Skill chips, level bars, timelines                                        */
/* ------------------------------------------------------------------------ */

/** Skills as highlighted "chips" (inline text with a background colour). */
export function skillChips(items, { background = SOFT, color = INK, fontSize = 8.8 } = {}) {
    const parts = [];
    items.forEach((item, index) => {
        if (index) parts.push({ text: '  ', fontSize });
        parts.push({ text: `  ${item.name.trim()}  `, background, color, fontSize });
    });
    return { text: parts, lineHeight: 1.9 };
}

const SKILL_RATIO = { basic: 0.3, intermediate: 0.55, advanced: 0.8, expert: 1 };
const LANGUAGE_RATIO = { a1: 0.18, a2: 0.32, b1: 0.48, b2: 0.64, c1: 0.8, c2: 0.92, native: 1 };

/** A horizontal level bar. */
export function levelBar(ratio, width, { accent, track = LINE, height = 4 } = {}) {
    const safe = Math.min(1, Math.max(0, ratio));
    return {
        canvas: [
            { type: 'rect', x: 0, y: 0, w: width, h: height, r: height / 2, color: track },
            ...(safe > 0 ? [{ type: 'rect', x: 0, y: 0, w: Math.max(height, width * safe), h: height, r: height / 2, color: accent }] : []),
        ],
        margin: [0, 2, 0, 5],
    };
}

/** Skills as "name + bar" rows (skills without a level get a full bar). */
export function skillBars(items, width, { accent, style = { fontSize: 9 } } = {}) {
    return items.flatMap((item) => [
        { text: item.name.trim(), ...style },
        levelBar(item.level ? (SKILL_RATIO[item.level] ?? 1) : 1, width, { accent }),
    ]);
}

/** Languages as "name – level + bar" rows. */
export function languageBars(items, width, { accent, style = { fontSize: 9 } } = {}) {
    return items.flatMap((item) => [
        { text: languageLabel(item), ...style },
        levelBar(item.level ? (LANGUAGE_RATIO[item.level] ?? 1) : 1, width, { accent }),
    ]);
}

/** Two-column grid of skill bars. */
export function skillBarsGrid(items, totalWidth, { accent, gap = 18, style } = {}) {
    const colWidth = (totalWidth - gap) / 2;
    const left = items.filter((_, i) => i % 2 === 0);
    const right = items.filter((_, i) => i % 2 === 1);
    return {
        columns: [
            { width: colWidth, stack: skillBars(left, colWidth, { accent, style }) },
            { width: colWidth, stack: skillBars(right, colWidth, { accent, style }) },
        ],
        columnGap: gap,
    };
}

/**
 * Entries along a vertical timeline: a dot per entry on a continuous line.
 * Built as a table so the line is drawn on every page the table spans.
 */
export function timelineEntries(ctx, section, { accent, titleStyle = { bold: true, fontSize: 10.5 }, subStyle = { color: MUTED, fontSize: 9.5 }, dateStyle = { color: accent, bold: true, fontSize: 8.5 }, bodyStyle = { fontSize: 9.5 } } = {}) {
    const gutter = 14;
    const rows = section.items.map((item) => {
        const s = entryShape(section.custom ? 'custom' : section.key, item);
        const head = [];
        if (s.date) head.push({ text: s.date, ...dateStyle, margin: [0, 0, 0, 1] });
        head.push({ text: s.primary || s.secondary || '', ...titleStyle });
        if (s.primary && s.secondary) head.push({ text: s.secondary, ...subStyle });
        const body = s.body ? textBlock(s.body, bodyStyle) : [];
        return [
            { canvas: [{ type: 'ellipse', x: gutter, y: 6, r1: 3.6, r2: 3.6, color: accent }], margin: [0, 0, 0, 0] },
            { stack: [...head, ...body] },
        ];
    });
    return {
        table: { widths: [gutter, '*'], body: rows },
        layout: {
            hLineWidth: () => 0,
            vLineWidth: (i) => (i === 1 ? 1.2 : 0),
            vLineColor: () => tint(accent, 0.6),
            paddingLeft: (i) => (i === 1 ? 12 : 0),
            paddingRight: () => 0,
            paddingTop: () => 2,
            paddingBottom: () => 10,
        },
    };
}
