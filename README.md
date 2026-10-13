# Krijo CV

Free, registration-less CV builder for **cv.saiddulevic.com**. Visitors fill in their
details, add a photo, pick one of fifteen templates, optionally write a cover letter and
download A4 PDFs. The whole CV (data, photo, PDF generation, preview, autosave,
import/export) lives in the visitor's browser; the server only serves the pages and
stores the owner's site settings.

The interface and the generated documents are available in **Albanian (default),
English, Italian, German and Spanish**. This file and `DEPLOYMENT.md` are in English; the admin panel is
in Albanian.

## Stack

| Layer | Choice |
| --- | --- |
| Backend | Laravel 13 (PHP ^8.3), Filament 5 (admin panel at `/admin`) |
| Front end | Blade + Filament Blade UI components, Alpine.js 3.17, Tailwind CSS 4, Vite 8 |
| PDF / Word | pdfmake 0.3.11 (generation), PDF.js 6.4 (preview), docx 9.9 (Word export), all bundled locally and loaded on demand |
| Fonts | Inter 4.1 and PT Serif (SIL OFL), served from `public/fonts` |
| Database | MySQL 8 (or MariaDB 10.6+) for admin users, settings, FAQ and template metadata only |

Everything is pinned in `composer.lock` and `package-lock.json`.

## Requirements

* PHP 8.3 or newer (CLI and web must be the same version) with the extensions
  `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `iconv`, `intl`,
  `json`, `mbstring`, `openssl`, `pcre`, `pdo`, `pdo_mysql`, `session`, `simplexml`,
  `tokenizer`, `xml`, `xmlwriter` and `zip` (Composer).
* Composer 2.
* MySQL 8.0+ or MariaDB 10.6+.
* Node.js 20+ and npm, **only** to build the assets (`npm run build`). The production
  site never runs Node; the compiled assets in `public/build` are committed.
* No Redis, queue workers, Docker, Chromium or root access are needed.

## Local setup

```bash
composer install
cp .env.example .env            # then set DB_* and APP_URL, APP_ENV=local, APP_DEBUG=true
php artisan key:generate
php artisan migrate --seed       # tables + default settings, FAQ and the 15 templates
php artisan krijo:make-admin     # creates the owner account (no default credentials exist)
npm ci
npm run build                    # or `npm run dev` while developing the front end
php artisan serve
```

Open `http://localhost:8000` for the public builder and `http://localhost:8000/admin`
for the panel.

### Useful commands

| Command | Purpose |
| --- | --- |
| `php artisan krijo:make-admin` | Create an administrator (prompts for name, email, password; `--update` resets an existing account) |
| `php artisan db:seed` | Re-run the seeders; existing settings/templates are never overwritten |
| `php artisan test` | PHP feature tests (public access, admin restrictions, settings, command) |
| `npm run test:js` | Node tests: all 15 templates × empty/short/long CVs, three document languages, cover letter, import validation, export round trip |
| `npm run brand-assets` | Regenerate the app icons and the Open Graph images |
| `npm run thumbnails` | Regenerate `public/images/templates/*.png` from the real templates with the sample CV |
| `node scripts/render-pages.mjs <template\|all> <short\|long> <outDir>` | Render every page of a template to PNG for visual checks |

## How it works

### Public builder (`/krijo`)

* `resources/js/builder/builder.js` is the Alpine component (`cvBuilder`) that owns the
  project object; `resources/js/builder/cropper.js` is the photo cropper.
* `resources/js/cv/schema.js` defines the project format, limits and the section headings
  and level names in all five languages; `validate.js` validates imported files (error
  messages in the visitor's language); `storage.js` wraps IndexedDB; `photo.js` decodes,
  downsizes, crops and masks photos on a canvas.
* `resources/js/cv/templates/*.js` are the fifteen pdfmake document builders (one file per
  template, `common.js` holds shared helpers and the fixed labels per language, `index.js`
  the registry) plus `letter.js`, the cover letter. They are plain JavaScript and run
  unchanged in the browser and in the Node tests/thumbnail script.
* `resources/js/cv/pdf/engine.js` loads pdfmake on demand, points it at the local fonts
  and produces the PDF blob. `preview.js` renders that same blob with PDF.js; renders are
  debounced and sequenced so an older render never replaces a newer one.
* The only server input is the template list, default accent colour, interface language
  and translated UI strings, embedded in the page. There is no route that accepts CV data; `tests/Feature/PublicPagesTest.php`
  asserts this and the browser network log shows GET requests for static assets only.

### Project file (`Emri_Mbiemri.cv.json`)

```json
{
  "format": "krijo-cv/project",
  "schemaVersion": 2,
  "exportedAt": "2026-10-06T08:00:00.000Z",
  "cv": { "personal": {}, "summary": "", "experience": [], "education": [], "skills": [],
          "languages": [], "certifications": [], "projects": [], "volunteer": [],
          "publications": [], "references": [], "custom": [] },
  "coverLetter": { "recipientName": "", "company": "", "subject": "", "salutation": "", "body": "", "closing": "" },
  "photo": { "data": "data:image/jpeg;base64,…", "source": "data:image/jpeg;base64,…", "crop": { "zoom": 1, "ox": 0, "oy": 0 } },
  "design": { "templateId": "modern", "accentColor": "#C1121F", "language": "sq", "showPhoto": true, "sectionOrder": [] }
}
```

Imports are validated field by field (types, lengths, entry counts, data-URL images,
template slug, colour), ids are regenerated, unknown keys dropped and the embedded image
is decoded before anything replaces the current project. Content is only ever rendered
as text. Files written by schema version 1 (no cover letter, no language) still import.

### Writing help, quality check and other tools

* **Writing help** (`resources/js/cv/phrases.js`, loaded on demand) – summaries, achievement
  bullets, action verbs and suggested skills for 12 professions in the CV language. Text
  in [square brackets] is a placeholder for the visitor.
* **CV check** (`quality.js`) – weighted checks with a 0–100 score shown in the toolbar and
  in step 5; each issue links to the step where it is fixed, and leftover [placeholders]
  are reported.
* **Undo / redo** (`history.js`) – toolbar buttons and Ctrl+Z / Ctrl+Y outside text
  fields; snapshots keep the photo by reference.
* **Word export** (`resources/js/cv/docx/export.js`, docx library loaded on demand) – CV
  and letter as editable `.docx` with the same content, headings, links and photo.
* **QR code** – optional, points to the website or LinkedIn link; drawn by pdfmake after the
  CV content, in the white main column for templates with a coloured side panel.
* **Letter drafts** (`letters.js`) – four application types in five languages that fill
  in the company and job title.

### Search engines and sharing

* `?lang=en` / `?lang=it` / `?lang=de` / `?lang=es` URLs are the crawlable language versions; every indexable page
  has canonical and hreflang links, Open Graph/Twitter tags with a per-language image
  (`public/images/og`), and JSON-LD (`WebApplication`, `FAQPage`, `WebPage`).
* `/sitemap.xml` and `/robots.txt` are generated routes (`SeoController`).
* Topic pages `/cv-ne-anglisht`, `/cv-ne-italisht`, `/cv-ne-gjermanisht`, `/cv-ne-spanjisht`,
  `/leter-motivimi` and `/modele-cv`
  (`config/krijo.php` + `lang/*/landing.php`) link into the builder with the CV language or
  step preset (`/krijo?gjuha_cv=en`, `/krijo?hapi=4`).

### Installable app and offline use

* `public/manifest.webmanifest`, icons in `public/icons` and the service worker
  `public/sw.js`. The worker caches only the site's own pages and static files
  (network-first for pages, cache-first for hashed `/build` files, stale-while-revalidate
  for fonts and images) and never `/admin` or Livewire requests. CV data is never in it.
* After one online visit the builder, PDF preview and downloads work offline. Browsers
  that support it show "Instalo aplikacionin" in the footer.
* `npm run brand-assets` regenerates the icons and sharing images.

### Languages and cover letter

* **Interface language** – `sq` (default), `en`, `it`, `de`, `es`. The header switcher links to
  `/gjuha/{locale}`, which stores the choice in the session and in a `krijo_locale`
  cookie (`SetLocale` middleware, public routes only). The browser's `Accept-Language`
  header is deliberately ignored so Albanian visitors with English-language browsers
  are not moved away from the default. Strings live in `lang/{sq,en,it,de,es}/ui.php`; a test
  checks that all five files have the same keys and placeholders.
* **Document language** (`design.language`, step 1) – section headings, level names and
  fixed labels such as "Present" in the PDF. It is independent of the interface
  language, and the text the visitor types is never translated.
* **Owner-managed texts** – the admin panel stores optional English, Italian, German and Spanish
  versions of the headline, description, footer text, privacy text, FAQ entries and template
  names/descriptions. Empty values fall back to the shipped defaults
  (`lang/{en,it,de,es}/site.php`, seeders) and finally to Albanian.
* **Cover letter** – step 4 of the builder. It reuses the CV's name, title, contacts,
  accent colour and (Executive template) serif font, downloads as a separate PDF
  (`Leter_Motivimi_…`, `Cover_Letter_…`, `Lettera_Motivazionale_…`), has its own preview
  tab and is saved inside the project file. No letter is created while the text is empty.

### Templates

| Slug | Name | Layout |
| --- | --- | --- |
| `minimal` | Minimal | Single column, monochrome, large name, thin dividers |
| `modern` | Modern | Grey sidebar (photo, contacts, skills, languages, certifications) + main column |
| `professional` | Profesional | Full-width header, then 65/35 columns |
| `executive` | Ekzekutiv | Single column, PT Serif, generous spacing, experience first |
| `creative` | Kreativ | Accent header band with round photo, shaded blocks, 3-column skills grid |
| `academic` | Akademik | Education, research projects, numbered publications, then experience; dates on the left |
| `student` | Student | Summary, education, projects, internships, volunteering, skills |
| `technology` | Teknologji | Projects with links, grouped technical skills, clear experience |
| `european` | Evropian | Narrow left column for labels and dates, wide right column (no Europass branding) |
| `compact` | Kompakt | Tight spacing, 9 pt body, flows onto extra pages instead of shrinking |
| `elegant` | Elegant | Full-height accent panel with round photo, contacts with icons, skills; serif name |
| `timeline` | Kronologjik | Experience and education on a vertical timeline, skills as tinted chips |
| `bold` | Guximtar | Dark full-width header with accent stripe, label headings, language level bars |
| `duotone` | Dyngjyrësh | Split two-colour header, short accent bars, level bars for skills and languages |
| `monogram` | Monogram | Centred medallion (photo or initials), two equal columns with a divider |

Section headings in templates stay in place when nothing follows them on a page
(`keepWithNext` in `common.js`); entries without a body are kept in one piece.

### Admin panel (`/admin`)

Owner-only Filament panel (login only, no registration, no password reset by email):

* **Cilësimet e faqes** – site name, logo text, headline, description, meta description,
  footer text and links, default accent colour, privacy text, the optional address of the
  public source code repository (shown on the privacy page and in the footer), plus optional
  English, Italian, German and Spanish versions of the texts.
* **Pyetjet e shpeshta** – FAQ entries (with optional English/Italian/German/Spanish versions),
  drag-and-drop ordering and publish toggle.
* **Modelet e CV-së** – template names, descriptions (also English/Italian/German/Spanish), order and
  availability. Templates cannot be created or deleted from the panel; their code ships
  with the application.

The panel never sees visitor CVs: there is no table for them (asserted by
`tests/Feature/AdminPanelTest.php`).

## Privacy summary

* No account, analytics or external API; only technical cookies (session, XSRF and the
  optional `krijo_locale` language choice). Fonts, scripts and PDF
  libraries are served from this site.
* CV data and photos stay in the browser. Optional autosave ("Ruaj automatikisht në këtë
  pajisje") stores the project in IndexedDB on that device only; it is off by default and
  can be deleted with "Fshi të dhënat nga kjo pajisje".
* The downloaded PDF (`CV_Emri_Mbiemri.pdf`) is A4, has selectable text, embedded fonts
  with Albanian characters, clickable links and no branding or watermark.

## Licences

Inter (`public/fonts/inter/LICENSE.txt`) and PT Serif (`public/fonts/pt-serif/OFL.txt`)
are distributed under the SIL Open Font License 1.1.

## Adding another language

The CV and interface languages are driven by data, so a sixth language touches these places:

1. `config/krijo.php` – `locales`, `og_locales` and the landing page list.
2. `lang/<code>/{ui,site,landing}.php` – the parity test lists the missing keys.
3. `resources/js/cv/` – `schema.js` (`LANGUAGES`, level and heading labels),
   `templates/common.js` (`LABELS`), `validate.js`, `letters.js`, `phrases*.js`, `sample.js`.
4. A migration for the `_<code>` columns of `faqs` and `cv_templates`, the seeders, the admin forms.
5. `scripts/make-brand-assets.mjs` (`OG_TEXT`) and `npm run brand-assets` for the share image.

## Open source and the privacy page

The source code is public at <https://github.com/saiddulevic/krijo-cv> and is released
under the MIT licence (see `LICENSE`).

The privacy page explains how visitors can verify that nothing is uploaded (browser
network tab) and, once the address is saved under **Cilësimet e faqes → Kodi burimor**,
links to the public repository. `.env`, `vendor/`, `node_modules/` and `storage/` are never
committed. Never commit real credentials: the production `.env` lives only on the server.

Third-party components keep their own licences: Inter (SIL Open Font License, see
`public/fonts/inter/LICENSE.txt`), pdfmake and docx (MIT), PDF.js (Apache-2.0), Laravel,
Filament, Alpine.js and the other packages listed in `composer.lock` and `package-lock.json`.
