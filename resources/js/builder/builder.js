/**
 * The public CV builder: an Alpine.js component that owns the whole visitor
 * project in the browser. Nothing in here sends CV data to the server.
 */
import {
    ACCENT_PRESETS,
    DEFAULT_ACCENT,
    FILE_EXTENSION,
    FORMAT,
    LANGUAGES,
    LANGUAGE_LEVELS,
    LIMITS,
    SCHEMA_VERSION,
    SKILL_LEVELS,
    accentLabel,
    cloneProject,
    emptyProject,
    fileNamePart,
    isCoverLetterEmpty,
    isEntryEmpty,
    languageLevelLabel,
    letterFilePrefix,
    newCustomSection,
    newEntry,
    normalizeLanguage,
    normalizeSectionOrder,
    sectionTitle,
    skillLevelLabel,
} from '../cv/schema.js';
import { sampleProject } from '../cv/sample.js';
import { parseProjectText, verifyPhoto } from '../cv/validate.js';
import { KEYS, isStorageAvailable, storageClear, storageDelete, storageGet, storageSet } from '../cv/storage.js';
import { checkPhotoFile, makeRoundPng, readImageFile } from '../cv/photo.js';
import { downloadBlob, generateLetterBlob, generatePdfBlob } from '../cv/pdf/engine.js';
import { createPreview } from '../cv/pdf/preview.js';
import { analyzeProject } from '../cv/quality.js';
import { History, restoreSnapshot, snapshotOf } from '../cv/history.js';
import { LETTER_TYPES, letterSkeleton, letterTypeLabel } from '../cv/letters.js';

const PREVIEW_DEBOUNCE = 450;
const AUTOSAVE_DEBOUNCE = 900;
const STEP_COUNT = 5;
const LETTER_STEP = 4;

const NATIVE_NAMES = { sq: 'Shqip', en: 'English', it: 'Italiano', de: 'Deutsch', es: 'Español' };
const HISTORY_DEBOUNCE = 500;

function isEditable(element) {
    if (!element) return false;
    if (element.isContentEditable) return true;
    const tag = element.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (tag !== 'INPUT') return false;
    return !['checkbox', 'radio', 'button', 'submit', 'range', 'color', 'file'].includes((element.type || '').toLowerCase());
}
const INTL_LOCALES = { sq: 'sq-AL', en: 'en-GB', it: 'it-IT', de: 'de-DE', es: 'es-ES' };

function emptyCache() {
    return { version: -1, blob: null };
}

export function cvBuilder(config = {}) {
    const uiLocale = normalizeLanguage(config.locale);
    const strings = config.strings && typeof config.strings === 'object' ? config.strings : {};

    return {
        templates: Array.isArray(config.templates) ? config.templates : [],
        defaultAccent: /^#[0-9a-fA-F]{6}$/.test(config.defaultAccent ?? '') ? config.defaultAccent.toUpperCase() : DEFAULT_ACCENT,
        uiLocale,
        cvLanguages: LANGUAGES.map((value) => ({ value, label: NATIVE_NAMES[value] })),
        accentPresets: ACCENT_PRESETS.map((preset) => ({ value: preset.value, label: accentLabel(preset, uiLocale) })),
        languageLevels: LANGUAGE_LEVELS.map((level) => ({ value: level.value, label: languageLevelLabel(level.value, uiLocale) })),
        skillLevels: SKILL_LEVELS.map((level) => ({ value: level.value, label: skillLevelLabel(level.value, uiLocale) })),
        limits: LIMITS,

        project: null,
        version: 0,
        step: 1,
        mobileTab: 'edit',
        previewDoc: 'cv',

        preview: { state: 'idle', pages: 0, error: '', width: 0 },
        downloading: false,
        storage: { available: null, autosave: false, savedAt: null, hasSaved: false, savedProject: null, saving: false },
        importing: false,
        importError: '',
        importFocus: config.import === true,
        photoError: '',
        cropper: { open: false, source: null, crop: null, busy: false },
        notice: { text: '', type: 'success' },
        confirm: { title: '', text: '', label: '', action: null },
        phrases: { open: false, loading: false, profession: '', target: null, data: null },
        letterTypes: LETTER_TYPES.map((type) => ({ id: type.id, label: letterTypeLabel(type, uiLocale) })),
        history: { canUndo: false, canRedo: false },
        cvPages: null,
        online: typeof navigator === 'undefined' ? true : navigator.onLine !== false,

        _renderer: null,
        _previewTimer: null,
        _autosaveTimer: null,
        _noticeTimer: null,
        _previewSeq: 0,
        _photoCache: null,
        _pdfCache: { cv: emptyCache(), letter: emptyCache() },
        _history: new History(),
        _historyTimer: null,
        _restoring: false,

        /* ------------------------------------------------------------ */
        /* Translations                                                  */
        /* ------------------------------------------------------------ */

        t(key, params = {}) {
            const template = typeof strings[key] === 'string' ? strings[key] : key;
            return template.replace(/:(\w+)/g, (match, name) => (name in params ? String(params[name]) : match));
        },

        /* ------------------------------------------------------------ */
        /* Lifecycle                                                     */
        /* ------------------------------------------------------------ */

        async init() {
            const preselected = typeof config.template === 'string' && this.templates.some((t) => t.id === config.template) ? config.template : this.firstTemplateId();
            const cvLanguage = typeof config.cvLanguage === 'string' ? normalizeLanguage(config.cvLanguage) : uiLocale;
            this.project = emptyProject({ templateId: preselected, accentColor: this.defaultAccent, language: cvLanguage });
            this._renderer = createPreview(this.$refs.previewPages);

            this.$watch('project', () => this.onProjectChanged());
            this.$watch('step', (value) => {
                this.mobileTab = 'edit';
                this.previewDoc = value === LETTER_STEP ? 'letter' : 'cv';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            this.$watch('previewDoc', () => this.schedulePreview(0));
            this.$watch('mobileTab', (tab) => {
                if (tab === 'preview') this.$nextTick(() => this.ensurePreviewWidth());
            });

            window.addEventListener('resize', () => this.ensurePreviewWidth());
            window.addEventListener('online', () => (this.online = true));
            window.addEventListener('offline', () => (this.online = false));
            window.addEventListener('keydown', (event) => this.onShortcut(event));
            window.addEventListener('beforeunload', (event) => {
                if (!this.storage.autosave && !this.isProjectEmpty()) {
                    event.preventDefault();
                    event.returnValue = '';
                }
            });

            await this.initStorage();
            if (config.sample === true && !this.storage.hasSaved) {
                this.applyProject(sampleProject({ templateId: preselected, accentColor: this.defaultAccent, language: cvLanguage }));
                this.notify(this.t('sample_loaded'));
            }
            this._history.reset(snapshotOf(this.project));
            if (Number.isInteger(config.step) && config.step > 1) this.step = Math.min(STEP_COUNT, config.step);
            this.schedulePreview(0);
        },

        async initStorage() {
            this.storage.available = await isStorageAvailable();
            if (!this.storage.available) return;
            const [enabled, saved] = await Promise.all([storageGet(KEYS.autosave), storageGet(KEYS.project)]);
            this.storage.autosave = enabled === true;
            if (this.storage.autosave && saved && saved.project && typeof saved.project === 'object') {
                this.storage.hasSaved = true;
                this.storage.savedAt = saved.savedAt ?? null;
                this.storage.savedProject = saved.project;
                this.openModal('resume-modal');
            }
        },

        onProjectChanged() {
            this.version += 1;
            this.schedulePreview();
            this.scheduleAutosave();
            if (this._restoring) {
                this._restoring = false;
                return;
            }
            window.clearTimeout(this._historyTimer);
            this._historyTimer = window.setTimeout(() => this.recordHistory(), HISTORY_DEBOUNCE);
        },

        /* ------------------------------------------------------------ */
        /* Undo / redo                                                   */
        /* ------------------------------------------------------------ */

        recordHistory() {
            window.clearTimeout(this._historyTimer);
            this._historyTimer = null;
            this._history.record(snapshotOf(this.project));
            this.syncHistoryFlags();
        },

        syncHistoryFlags() {
            this.history.canUndo = this._history.canUndo;
            this.history.canRedo = this._history.canRedo;
        },

        restore(snapshot) {
            if (!snapshot) return;
            this._restoring = true;
            this.applyProject(restoreSnapshot(snapshot));
            this.syncHistoryFlags();
        },

        undo() {
            if (this._historyTimer) this.recordHistory();
            this.restore(this._history.undo());
        },

        redo() {
            if (this._historyTimer) this.recordHistory();
            this.restore(this._history.redo());
        },

        /** Ctrl/Cmd+Z and Ctrl/Cmd+Y outside text fields (fields keep their own undo). */
        onShortcut(event) {
            if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
            const key = (event.key || '').toLowerCase();
            if (key !== 'z' && key !== 'y') return;
            if (isEditable(document.activeElement)) return;
            event.preventDefault();
            if (key === 'y' || event.shiftKey) this.redo();
            else this.undo();
        },

        /* ------------------------------------------------------------ */
        /* Quality check                                                 */
        /* ------------------------------------------------------------ */

        get quality() {
            return this.project ? analyzeProject(this.project, { pages: this.cvPages ?? undefined }) : { score: 0, grade: 'weak', checks: [], issues: [], passed: 0 };
        },

        qualityMessage(issue) {
            return this.t(`q_${issue.id}`, issue.params);
        },

        get qualityGradeLabel() {
            return this.t(`grade_${this.quality.grade}`);
        },

        showQuality() {
            this.goTo(5);
            this.$nextTick(() => document.getElementById('cv-quality')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        },

        /* ------------------------------------------------------------ */
        /* Writing help (phrase library, loaded on demand)               */
        /* ------------------------------------------------------------ */

        async openPhrases(kind, entryId = null) {
            this.phrases.target = { kind, entryId };
            this.phrases.open = true;
            this.openModal('phrases-modal');
            if (!this.phrases.data) {
                this.phrases.loading = true;
                try {
                    const module = await import('../cv/phrases.js');
                    this.phrases.data = { professions: module.PROFESSIONS, verbs: module.ACTION_VERBS, appendBullet: module.appendBullet, appendSentence: module.appendSentence };
                    if (!this.phrases.profession) this.phrases.profession = module.PROFESSIONS[0].id;
                } catch (error) {
                    console.error(error);
                    this.notify(this.t('phrases_failed'), 'danger');
                } finally {
                    this.phrases.loading = false;
                }
            }
        },

        get professionOptions() {
            return (this.phrases.data?.professions ?? []).map((p) => ({ id: p.id, label: p.label[uiLocale] ?? p.label.sq }));
        },

        get phraseSet() {
            const data = this.phrases.data;
            if (!data) return { summaries: [], bullets: [], skills: [], verbs: [] };
            const lang = this.project.design.language;
            const profession = data.professions.find((p) => p.id === this.phrases.profession) ?? data.professions[0];
            return {
                summaries: profession.summaries[lang] ?? profession.summaries.sq,
                bullets: profession.bullets[lang] ?? profession.bullets.sq,
                skills: profession.skills[lang] ?? profession.skills.sq,
                verbs: data.verbs[lang] ?? data.verbs.sq,
            };
        },

        get phraseTargetEntry() {
            const id = this.phrases.target?.entryId;
            return id ? this.project.cv.experience.find((e) => e.id === id) ?? null : null;
        },

        insertSummary(text) {
            this.project.cv.summary = this.phrases.data.appendSentence(this.project.cv.summary, text);
            this.notify(this.t('phrase_added'));
        },

        insertBullet(text) {
            const entry = this.phraseTargetEntry;
            if (!entry) return;
            entry.description = this.phrases.data.appendBullet(entry.description, text);
            this.notify(this.t('phrase_added'));
        },

        insertVerb(verb) {
            const entry = this.phraseTargetEntry;
            if (!entry) return;
            entry.description = this.phrases.data.appendBullet(entry.description, `${verb} `);
            this.closeModal('phrases-modal');
            this.$nextTick(() => {
                const field = document.getElementById(`exp-description-${entry.id}`);
                if (field) {
                    field.focus();
                    field.setSelectionRange(field.value.length, field.value.length);
                }
            });
        },

        hasSkill(name) {
            const wanted = name.trim().toLowerCase();
            return this.project.cv.skills.some((s) => (s.name ?? '').trim().toLowerCase() === wanted);
        },

        addSuggestedSkill(name) {
            if (this.hasSkill(name)) return;
            if (!this.canAddEntry('skills')) {
                this.notify(this.t('limit_entries', { max: this.entryLimit('skills') }), 'warning');
                return;
            }
            const entry = newEntry('skills');
            entry.name = name;
            this.project.cv.skills.push(entry);
            this.notify(this.t('skill_added', { name }));
        },

        /* ------------------------------------------------------------ */
        /* Cover letter starters                                         */
        /* ------------------------------------------------------------ */

        applyLetterType(typeId) {
            if (!typeId) return;
            const apply = () => {
                const skeleton = letterSkeleton(typeId, this.project);
                const letter = this.project.coverLetter;
                if (!(letter.subject ?? '').trim()) letter.subject = skeleton.subject;
                if (!(letter.salutation ?? '').trim()) letter.salutation = skeleton.salutation;
                if (!(letter.closing ?? '').trim()) letter.closing = skeleton.closing;
                letter.body = skeleton.body;
                this.notify(this.t('letter_started'));
            };
            if ((this.project.coverLetter.body ?? '').trim()) {
                this.askConfirm({ title: this.t('letter_replace_title'), text: this.t('letter_replace_text'), label: this.t('letter_replace_label'), action: apply });
                return;
            }
            apply();
        },

        /* ------------------------------------------------------------ */
        /* Helpers                                                       */
        /* ------------------------------------------------------------ */

        firstTemplateId() {
            return this.templates[0]?.id ?? 'minimal';
        },

        get steps() {
            return Array.from({ length: STEP_COUNT }, (_, index) => ({
                number: index + 1,
                short: this.t(`step${index + 1}_short`),
                title: this.t(`step${index + 1}_title`),
            }));
        },

        get totalSteps() {
            return STEP_COUNT;
        },

        get fullName() {
            const p = this.project?.cv.personal ?? {};
            return [p.firstName, p.lastName].map((s) => (s ?? '').trim()).filter(Boolean).join(' ');
        },

        get canDownload() {
            const p = this.project?.cv.personal ?? {};
            return Boolean((p.firstName ?? '').trim() && (p.lastName ?? '').trim());
        },

        get letterHasContent() {
            return Boolean(this.project) && !isCoverLetterEmpty(this.project.coverLetter);
        },

        get canDownloadLetter() {
            return this.canDownload && this.letterHasContent;
        },

        get emailInvalid() {
            const email = (this.project?.cv.personal.email ?? '').trim();
            return email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        get stepTitle() {
            return this.steps[this.step - 1]?.title ?? '';
        },

        get selectedTemplate() {
            return this.templates.find((t) => t.id === this.project?.design.templateId) ?? null;
        },

        get savedAtText() {
            if (!this.storage.savedAt) return '';
            try {
                return new Intl.DateTimeFormat(INTL_LOCALES[uiLocale], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(this.storage.savedAt));
            } catch {
                return this.storage.savedAt;
            }
        },

        get pagesLabel() {
            const rule = new Intl.PluralRules(INTL_LOCALES[uiLocale]).select(this.preview.pages);
            return this.t(rule === 'one' ? 'pages_one' : 'pages_other', { n: this.preview.pages });
        },

        get pdfFileName() {
            return `CV_${fileNamePart(this.project)}.pdf`;
        },

        get letterFileName() {
            return `${letterFilePrefix(this.project.design.language)}_${fileNamePart(this.project)}.pdf`;
        },

        isStepComplete(number) {
            if (!this.project) return false;
            const cv = this.project.cv;
            switch (number) {
                case 1:
                    return this.canDownload;
                case 2:
                    return (cv.summary ?? '').trim() !== '' || cv.experience.some((e) => !isEntryEmpty(e));
                case 3:
                    return cv.education.some((e) => !isEntryEmpty(e)) || cv.skills.some((e) => !isEntryEmpty(e));
                case LETTER_STEP:
                    return this.letterHasContent;
                default:
                    return false;
            }
        },

        isProjectEmpty() {
            if (!this.project) return true;
            const empty = emptyProject();
            const current = cloneProject(this.project);
            return (
                JSON.stringify(current.cv) === JSON.stringify(empty.cv) &&
                isCoverLetterEmpty(current.coverLetter) &&
                !current.photo
            );
        },

        notify(text, type = 'success') {
            this.notice = { text, type };
            window.clearTimeout(this._noticeTimer);
            this._noticeTimer = window.setTimeout(() => {
                this.notice = { text: '', type };
            }, 5000);
        },

        openModal(id) {
            this.$dispatch('open-modal', { id });
        },

        closeModal(id) {
            this.$dispatch('close-modal', { id });
        },

        askConfirm({ title, text, label, action }) {
            this.confirm = { title, text, label: label ?? this.t('confirm_label'), action };
            this.openModal('confirm-modal');
        },

        runConfirm() {
            const action = this.confirm.action;
            this.closeModal('confirm-modal');
            this.confirm.action = null;
            if (typeof action === 'function') action();
        },

        confirmDelete({ titleKey, textKey, action }) {
            this.askConfirm({ title: this.t(titleKey), text: this.t(textKey), label: this.t('delete'), action });
        },

        /* ------------------------------------------------------------ */
        /* Navigation                                                    */
        /* ------------------------------------------------------------ */

        goTo(number) {
            if (number >= 1 && number <= STEP_COUNT) this.step = number;
        },

        next() {
            this.goTo(this.step + 1);
        },

        prev() {
            this.goTo(this.step - 1);
        },

        /* ------------------------------------------------------------ */
        /* Repeated entries                                              */
        /* ------------------------------------------------------------ */

        entryLimit(section) {
            return section === 'skills' ? LIMITS.skills : LIMITS.entries;
        },

        canAddEntry(section) {
            return this.project.cv[section].length < this.entryLimit(section);
        },

        addEntry(section) {
            if (!this.canAddEntry(section)) {
                this.notify(this.t('limit_entries', { max: this.entryLimit(section) }), 'warning');
                return;
            }
            const entry = newEntry(section);
            this.project.cv[section].push(entry);
            this.focusEntry(entry.id);
        },

        removeEntry(section, index) {
            const entry = this.project.cv[section][index];
            const remove = () => this.project.cv[section].splice(index, 1);
            if (isEntryEmpty(entry)) {
                remove();
                return;
            }
            this.confirmDelete({ titleKey: 'delete_entry_title', textKey: 'delete_entry_text', action: remove });
        },

        moveEntry(section, index, delta) {
            this.moveInArray(this.project.cv[section], index, delta);
        },

        moveInArray(list, index, delta) {
            const target = index + delta;
            if (target < 0 || target >= list.length) return;
            const [item] = list.splice(index, 1);
            list.splice(target, 0, item);
        },

        focusEntry(id) {
            this.$nextTick(() => {
                const element = document.querySelector(`[data-entry="${id}"] input, [data-entry="${id}"] textarea`);
                element?.focus();
            });
        },

        /* ------------------------------------------------------------ */
        /* Custom sections and section order                             */
        /* ------------------------------------------------------------ */

        get canAddCustomSection() {
            return this.project.cv.custom.length < LIMITS.customSections;
        },

        addCustomSection() {
            if (!this.canAddCustomSection) {
                this.notify(this.t('limit_custom', { max: LIMITS.customSections }), 'warning');
                return;
            }
            const section = newCustomSection('');
            section.entries.push(newEntry('custom'));
            this.project.cv.custom.push(section);
            this.project.design.sectionOrder.push(`custom:${section.id}`);
            this.$nextTick(() => document.getElementById(`custom-title-${section.id}`)?.focus());
        },

        removeCustomSection(index) {
            const section = this.project.cv.custom[index];
            const remove = () => {
                this.project.cv.custom.splice(index, 1);
                this.project.design.sectionOrder = this.project.design.sectionOrder.filter((key) => key !== `custom:${section.id}`);
            };
            if (!(section.title ?? '').trim() && section.entries.every(isEntryEmpty)) {
                remove();
                return;
            }
            this.confirmDelete({ titleKey: 'delete_section_title', textKey: 'delete_section_text', action: remove });
        },

        addCustomEntry(sectionIndex) {
            const section = this.project.cv.custom[sectionIndex];
            if (section.entries.length >= LIMITS.entries) {
                this.notify(this.t('limit_entries', { max: LIMITS.entries }), 'warning');
                return;
            }
            const entry = newEntry('custom');
            section.entries.push(entry);
            this.focusEntry(entry.id);
        },

        removeCustomEntry(sectionIndex, index) {
            const section = this.project.cv.custom[sectionIndex];
            const remove = () => section.entries.splice(index, 1);
            if (isEntryEmpty(section.entries[index])) {
                remove();
                return;
            }
            this.confirmDelete({ titleKey: 'delete_entry_title', textKey: 'delete_entry_text', action: remove });
        },

        sectionLabel(key) {
            if (key.startsWith('custom:')) {
                const section = this.project.cv.custom.find((s) => `custom:${s.id}` === key);
                return (section?.title ?? '').trim() || this.t('untitled_section');
            }
            return sectionTitle(key, this.project.design.language);
        },

        sectionHasContent(key) {
            const cv = this.project.cv;
            if (key === 'summary') return (cv.summary ?? '').trim() !== '';
            if (key.startsWith('custom:')) {
                const section = cv.custom.find((s) => `custom:${s.id}` === key);
                return Boolean(section && section.entries.some((e) => !isEntryEmpty(e)));
            }
            return (cv[key] ?? []).some((e) => !isEntryEmpty(e));
        },

        moveSection(index, delta) {
            const order = [...this.project.design.sectionOrder];
            const target = index + delta;
            if (target < 0 || target >= order.length) return;
            const [item] = order.splice(index, 1);
            order.splice(target, 0, item);
            this.project.design.sectionOrder = order;
        },

        /* ------------------------------------------------------------ */
        /* Design                                                        */
        /* ------------------------------------------------------------ */

        selectTemplate(id) {
            if (this.templates.some((t) => t.id === id)) this.project.design.templateId = id;
        },

        setAccent(value) {
            if (/^#[0-9a-fA-F]{6}$/.test(value ?? '')) this.project.design.accentColor = value.toUpperCase();
        },

        /* ------------------------------------------------------------ */
        /* Photo                                                         */
        /* ------------------------------------------------------------ */

        async onPhotoSelected(event) {
            const input = event.target;
            const file = input.files?.[0];
            input.value = '';
            const problem = checkPhotoFile(file);
            if (problem) {
                this.photoError = this.t(`photo_${problem}`);
                return;
            }
            this.photoError = '';
            this.cropper.busy = true;
            try {
                const { dataUrl } = await readImageFile(file);
                this.openCropper(dataUrl, null);
            } catch {
                this.photoError = this.t('photo_unreadable');
            } finally {
                this.cropper.busy = false;
            }
        },

        openCropper(source, crop) {
            this.cropper.source = source;
            this.cropper.crop = crop;
            this.cropper.open = true;
            this.openModal('photo-cropper');
        },

        editPhoto() {
            if (this.project.photo?.source) {
                this.openCropper(this.project.photo.source, this.project.photo.crop);
            } else if (this.project.photo?.data) {
                this.openCropper(this.project.photo.data, null);
            }
        },

        applyCrop({ data, crop }) {
            this.project.photo = { data, source: this.cropper.source, crop };
            this.closeCropper();
            this.notify(this.t('photo_saved'));
        },

        closeCropper() {
            this.cropper.open = false;
            this.closeModal('photo-cropper');
        },

        removePhoto() {
            this.project.photo = null;
            this.photoError = '';
        },

        async photosForPdf() {
            const photo = this.project.photo;
            if (!photo?.data) return null;
            if (this._photoCache?.key === photo.data) return this._photoCache.value;
            const round = await makeRoundPng(photo.data);
            this._photoCache = { key: photo.data, value: { square: photo.data, round } };
            return this._photoCache.value;
        },

        /* ------------------------------------------------------------ */
        /* PDF preview and download                                      */
        /* ------------------------------------------------------------ */

        previewWidth() {
            const container = this.$refs.previewPages;
            const width = container?.clientWidth || 0;
            if (width >= 120) return Math.min(width, 820);
            return Math.min(Math.max(window.innerWidth - 32, 280), 760);
        },

        ensurePreviewWidth() {
            const width = this.previewWidth();
            if (this.preview.state === 'ready' && Math.abs(width - this.preview.width) > 24) {
                this.schedulePreview(150);
            }
        },

        schedulePreview(delay = PREVIEW_DEBOUNCE) {
            window.clearTimeout(this._previewTimer);
            this._previewTimer = window.setTimeout(() => this.renderPreview(), delay);
        },

        /** Returns the PDF blob of the CV or of the cover letter, reusing the last result for the same project version. */
        async pdfBlob(kind = 'cv') {
            const cached = this._pdfCache[kind];
            if (cached.blob && cached.version === this.version) {
                return cached.blob;
            }
            const version = this.version;
            const snapshot = cloneProject(this.project);
            const blob = kind === 'letter' ? await generateLetterBlob(snapshot) : await generatePdfBlob(snapshot, await this.photosForPdf());
            if (version === this.version) {
                this._pdfCache[kind] = { version, blob };
            }
            return blob;
        },

        async renderPreview() {
            const seq = ++this._previewSeq;
            this.preview.state = this.preview.state === 'ready' ? 'updating' : 'loading';
            this.preview.error = '';
            try {
                const blob = await this.pdfBlob(this.previewDoc);
                if (seq !== this._previewSeq) return;
                const width = this.previewWidth();
                const result = await this._renderer.render(blob, {
                    width,
                    pageLabel: (n, total) => this.t('page_n_of', { n, total }),
                });
                if (!result || seq !== this._previewSeq) return;
                this.preview.pages = result.pages;
                if (this.previewDoc === 'cv') this.cvPages = result.pages;
                this.preview.width = width;
                this.preview.state = 'ready';
            } catch (error) {
                if (seq !== this._previewSeq) return;
                console.error(error);
                this.preview.state = 'error';
                this.preview.error = this.t('preview_failed');
            }
        },

        async download(kind) {
            const allowed = kind === 'letter' ? this.canDownloadLetter : this.canDownload;
            if (!allowed || this.downloading) return;
            this.downloading = true;
            try {
                const blob = await this.pdfBlob(kind);
                downloadBlob(blob, kind === 'letter' ? this.letterFileName : this.pdfFileName);
                this.notify(this.t(kind === 'letter' ? 'letter_downloaded' : 'pdf_downloaded'));
            } catch (error) {
                console.error(error);
                this.notify(this.t('download_failed'), 'danger');
            } finally {
                this.downloading = false;
            }
        },

        downloadPdf() {
            return this.download('cv');
        },

        downloadLetter() {
            return this.download('letter');
        },

        /** Word export of the CV or the letter (docx library loaded on demand). */
        async downloadDocx(kind = 'cv') {
            const allowed = kind === 'letter' ? this.canDownloadLetter : this.canDownload;
            if (!allowed || this.downloading) return;
            this.downloading = true;
            try {
                const docx = await import('../cv/docx/export.js');
                const snapshot = cloneProject(this.project);
                const document = kind === 'letter' ? docx.buildLetterDocx(snapshot) : docx.buildCvDocx(snapshot, await this.photosForPdf());
                const blob = await docx.docxToBlob(document);
                const name = (kind === 'letter' ? this.letterFileName : this.pdfFileName).replace(/\.pdf$/, '.docx');
                downloadBlob(blob, name);
                this.notify(this.t('docx_downloaded'));
            } catch (error) {
                console.error(error);
                this.notify(this.t('download_failed'), 'danger');
            } finally {
                this.downloading = false;
            }
        },

        get qrMissing() {
            const target = this.project.design.qrTarget;
            return Boolean(target) && !(this.project.cv.personal[target] ?? '').trim();
        },

        /** Download button of the preview panel: the document currently shown. */
        downloadPreviewed() {
            return this.download(this.previewDoc);
        },

        get canDownloadPreviewed() {
            return this.previewDoc === 'letter' ? this.canDownloadLetter : this.canDownload;
        },

        /* ------------------------------------------------------------ */
        /* Project export / import / samples                             */
        /* ------------------------------------------------------------ */

        exportProject() {
            const data = cloneProject(this.project);
            data.format = FORMAT;
            data.schemaVersion = SCHEMA_VERSION;
            data.exportedAt = new Date().toISOString();
            data.design.sectionOrder = normalizeSectionOrder(data.design.sectionOrder, data.cv.custom);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            downloadBlob(blob, `${fileNamePart(this.project)}${FILE_EXTENSION}`);
            this.notify(this.t('project_saved'));
        },

        onImportSelected(event) {
            const input = event.target;
            const file = input.files?.[0];
            input.value = '';
            this.importFromFile(file);
        },

        async importFromFile(file) {
            this.importError = '';
            if (!file) return;
            if (file.size > LIMITS.fileBytes) {
                this.importError = this.t('file_too_large');
                return;
            }
            this.importing = true;
            try {
                const text = await file.text();
                const result = parseProjectText(text, uiLocale);
                if (!result.ok) {
                    this.importError = result.error;
                    return;
                }
                if (!(await verifyPhoto(result.project.photo))) {
                    this.importError = this.t('photo_in_file_broken');
                    return;
                }
                const project = result.project;
                let notice = this.t('imported');
                if (!this.templates.some((t) => t.id === project.design.templateId)) {
                    project.design.templateId = this.firstTemplateId();
                    notice = this.t('imported_template_missing');
                }
                this.applyProject(project);
                this.importFocus = false;
                this.step = 1;
                this.notify(notice);
            } catch {
                this.importError = this.t('file_unreadable');
            } finally {
                this.importing = false;
            }
        },

        applyProject(project) {
            this._photoCache = null;
            this._pdfCache = { cv: emptyCache(), letter: emptyCache() };
            this.project = project;
        },

        loadSample() {
            const apply = () => {
                this.applyProject(
                    sampleProject({
                        templateId: this.project.design.templateId,
                        accentColor: this.defaultAccent,
                        language: this.project.design.language,
                    }),
                );
                this.step = 1;
                this.notify(this.t('sample_loaded'));
            };
            if (this.isProjectEmpty()) {
                apply();
                return;
            }
            this.askConfirm({ title: this.t('sample_title'), text: this.t('sample_text'), label: this.t('sample_label'), action: apply });
        },

        newProject() {
            const apply = () => {
                this.applyProject(
                    emptyProject({
                        templateId: this.project.design.templateId,
                        accentColor: this.defaultAccent,
                        language: this.project.design.language,
                    }),
                );
                this.step = 1;
                this.importError = '';
                this.photoError = '';
                this.notify(this.t('new_project'));
            };
            if (this.isProjectEmpty()) {
                apply();
                return;
            }
            this.askConfirm({ title: this.t('new_title'), text: this.t('new_text'), label: this.t('new_label'), action: apply });
        },

        /* ------------------------------------------------------------ */
        /* Local autosave (IndexedDB)                                    */
        /* ------------------------------------------------------------ */

        scheduleAutosave() {
            if (!this.storage.autosave || !this.storage.available) return;
            window.clearTimeout(this._autosaveTimer);
            this._autosaveTimer = window.setTimeout(() => this.saveNow(), AUTOSAVE_DEBOUNCE);
        },

        async saveNow() {
            if (!this.storage.autosave || !this.storage.available) return;
            this.storage.saving = true;
            try {
                const savedAt = new Date().toISOString();
                await storageSet(KEYS.project, { savedAt, project: cloneProject(this.project) });
                this.storage.savedAt = savedAt;
                this.storage.hasSaved = true;
            } catch {
                this.storage.available = false;
                this.storage.autosave = false;
                this.notify(this.t('autosave_failed'), 'warning');
            } finally {
                this.storage.saving = false;
            }
        },

        async toggleAutosave() {
            if (!this.storage.available) return;
            const next = !this.storage.autosave;
            try {
                await storageSet(KEYS.autosave, next);
                this.storage.autosave = next;
                if (next) {
                    await this.saveNow();
                    this.notify(this.t('autosave_on'));
                } else {
                    await storageDelete(KEYS.project);
                    this.storage.savedAt = null;
                    this.storage.hasSaved = false;
                    this.notify(this.t('autosave_off'));
                }
            } catch {
                this.storage.available = false;
                this.storage.autosave = false;
                this.notify(this.t('autosave_unavailable'), 'warning');
            }
        },

        confirmClearDevice() {
            this.askConfirm({
                title: this.t('clear_title'),
                text: this.t('clear_text'),
                label: this.t('clear_label'),
                action: () => this.clearDevice(),
            });
        },

        async clearDevice() {
            try {
                await storageClear();
            } catch {
                // storage unavailable: nothing to delete
            }
            this.storage.autosave = false;
            this.storage.savedAt = null;
            this.storage.hasSaved = false;
            this.storage.savedProject = null;
            this.notify(this.t('cleared'));
        },

        resumeSaved() {
            const saved = this.storage.savedProject;
            this.closeModal('resume-modal');
            if (!saved) return;
            const result = parseProjectText(JSON.stringify(saved), uiLocale);
            if (!result.ok) {
                this.notify(this.t('resume_failed'), 'warning');
                return;
            }
            const project = result.project;
            if (!this.templates.some((t) => t.id === project.design.templateId)) {
                project.design.templateId = this.firstTemplateId();
            }
            this.applyProject(project);
            this.storage.savedProject = null;
            this.notify(this.t('resumed'));
        },

        async discardSaved() {
            this.closeModal('resume-modal');
            this.storage.savedProject = null;
            try {
                await storageDelete(KEYS.project);
            } catch {
                // ignore
            }
            this.storage.savedAt = null;
            this.storage.hasSaved = false;
        },
    };
}
