# Deploying Krijo CV to cPanel (cv.saiddulevic.com)

This guide assumes ordinary shared cPanel hosting with **Terminal** (or SSH) access, no
root/sudo, no Docker, no Redis and no permanent Node.js process. The production site
needs only PHP, MySQL and the committed assets in `public/build`.

Replace `cpaneluser` with your cPanel username everywhere below. Paths assume the
application lives in `/home/cpaneluser/apps/krijo-cv` (outside `public_html`).

---

## 1. Check the server

Open **Terminal** in cPanel (or connect with SSH) and run:

```bash
php -v
php -m | grep -iE "bcmath|ctype|curl|dom|fileinfo|filter|intl|mbstring|openssl|pdo_mysql|tokenizer|xml|zip"
composer --version || /opt/cpanel/composer/bin/composer --version
node -v; npm -v
mysql --version
```

Requirements:

* PHP **8.3 or newer**.
* Extensions `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `intl`, `mbstring`,
  `openssl`, `pdo_mysql`, `tokenizer`, `xml`, `xmlwriter`, `zip`. Enable missing ones in
  cPanel → **Select PHP Version** (CloudLinux) or **MultiPHP INI Editor**.
* Composer 2. If `composer` is not on the PATH, cPanel usually ships it at
  `/opt/cpanel/composer/bin/composer`; otherwise install it locally:
  `curl -sS https://getcomposer.org/installer | php -- --install-dir=$HOME/bin --filename=composer`
  (create `$HOME/bin` first and add it to the PATH in `~/.bashrc`).
* Node.js/npm are **optional** (see step 10). The site does not run `npm run dev` or a
  Vite server in production.

### Make the terminal PHP match the website PHP

The PHP version used by the terminal must be the one selected for the subdomain,
otherwise Composer may install packages for the wrong version. Check:

```bash
php -v
```

If it differs from the version chosen in **Select PHP Version** / **MultiPHP Manager**,
call the right binary explicitly, for example on CloudLinux:

```bash
alias php=/opt/cpanel/ea-php83/root/usr/bin/php
# or on servers with alt-php:
alias php=/opt/alt/php83/usr/bin/php
```

Use that same `php` for every `php artisan` and `composer` call below
(`php /path/to/composer ...` also works).

## 2. Create the database and user

cPanel → **MySQL® Databases**:

1. Create database `cpaneluser_krijo_cv`.
2. Create user `cpaneluser_krijo` with a strong password.
3. Add the user to the database with **ALL PRIVILEGES**.

Note the full names (cPanel prefixes them with your username).

## 3. Create the subdomain and point it at `public/`

cPanel → **Domains** → *Create a New Domain* → `cv.saiddulevic.com`.
Set the **Document Root** to `/home/cpaneluser/apps/krijo-cv/public`.
(Create the directory first if the form insists it must exist: `mkdir -p ~/apps/krijo-cv/public`.)

The Laravel source, `.env`, `vendor/` and `storage/` stay outside the document root and
are never reachable over HTTP.

## 4. Upload or clone the application

Either clone the repository:

```bash
mkdir -p ~/apps && cd ~/apps
git clone <repository-url> krijo-cv
cd krijo-cv
```

or upload a zip of the project (without `node_modules/` and `vendor/`) through the
**File Manager** and extract it into `~/apps/krijo-cv`.

## 5. Configure `.env`

```bash
cd ~/apps/krijo-cv
cp .env.example .env
nano .env
```

Set at least:

```ini
APP_NAME="Krijo CV"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://cv.saiddulevic.com
APP_LOCALE=sq

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cpaneluser_krijo_cv
DB_USERNAME=cpaneluser_krijo
DB_PASSWORD=the-password-from-step-2

SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
CACHE_STORE=file
QUEUE_CONNECTION=sync
LOG_LEVEL=error
```

Leave `APP_KEY` empty for now; step 7 generates it.

## 6. Install PHP dependencies

```bash
cd ~/apps/krijo-cv
composer install --no-dev --optimize-autoloader --no-interaction
```

Composer's `post-autoload-dump` hook runs `php artisan filament:upgrade`, which publishes
Filament's CSS/JS into `public/css/filament`, `public/js/filament` and
`public/fonts/filament`. These directories are git-ignored on purpose and recreated on
every install/update.

## 7. Generate the application key (first installation only)

```bash
php artisan key:generate --force
```

**Never run this again on an existing installation**: a new key invalidates sessions and
anything encrypted with the old key. The key is stored in `.env`, which is not in git.

## 8. Run migrations and seeders

```bash
php artisan migrate --force
php artisan db:seed --force
```

The seeders insert the default site texts, the FAQ entries and the ten templates
(all enabled). They never overwrite rows that already exist, so they are safe to run
again after an update.

## 9. Create the administrator account

```bash
php artisan krijo:make-admin
```

You are prompted for a name, an email address and a password (minimum 12 characters,
typed without echo). No default credentials exist. To change the password of an existing
account later:

```bash
php artisan krijo:make-admin --email=owner@example.com --update
```

## 10. Front-end assets

The compiled Vite assets (`public/build/manifest.json` and `public/build/assets/*`) are
committed to the repository, so **nothing needs to be built on the server** after a plain
clone. Filament's own assets were published in step 6.

Rebuild only if you changed files under `resources/`:

* **If `npm` works in the cPanel terminal:**

  ```bash
  npm ci
  npm run build
  rm -rf node_modules      # optional, frees space; not needed at runtime
  ```

* **If `npm` is unavailable** (most shared hosts): build on your computer and upload the
  result.

  ```bash
  # on your computer
  npm ci
  npm run build
  ```

  Then upload the whole `public/build` directory (it must contain `manifest.json` and the
  `assets/` folder) to `~/apps/krijo-cv/public/build` on the server, replacing the old
  one. Committing `public/build` and pulling it on the server achieves the same.

Make sure `public/hot` does **not** exist on the server; its presence would make Laravel
look for a Vite dev server.

## 11. Permissions

```bash
cd ~/apps/krijo-cv
chmod -R u+rwX,go-rwx storage bootstrap/cache
chmod 600 .env
```

On cPanel the PHP process runs as your own user, so no `chown` or group changes are
needed. If pages show a permission error, check that `storage/logs`,
`storage/framework/{cache,sessions,views}` and `bootstrap/cache` are writable.

## 12. Production optimisation

```bash
php artisan optimize
php artisan filament:optimize
```

`optimize` caches config, routes, views and events; `filament:optimize` caches the
panel's components and icons. Run `php artisan optimize:clear` and
`php artisan filament:optimize-clear` before changing `.env` or code, then both
`optimize` commands again.

## 13. HTTPS

cPanel → **SSL/TLS Status** → select `cv.saiddulevic.com` → **Run AutoSSL** (Let's
Encrypt / Sectigo). Once the certificate is issued, force HTTPS either with cPanel →
**Domains** → *Force HTTPS Redirect*, or by adding to the top of `public/.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

`APP_URL` must be the `https://` address and `SESSION_SECURE_COOKIE=true` so the admin
login cookie is only sent over HTTPS.

## 14. Verify

1. `https://cv.saiddulevic.com/` shows the homepage with the headline, the template
   gallery and the FAQ. No login is required.
2. `https://cv.saiddulevic.com/krijo` loads the builder; the PDF preview appears within a
   few seconds and the "Shkarko PDF" button becomes active once a first and last name are
   entered. Open the browser's network tab: after the page loads, only static files
   (JS, CSS, fonts, PNG thumbnails) are requested; nothing is posted.
3. `https://cv.saiddulevic.com/admin` redirects to the login page; log in with the
   account from step 9 and change the headline under **Cilësimet e faqes**. The homepage
   reflects the change immediately.
4. `https://cv.saiddulevic.com/gjuha/en` redirects back and the page switches to English
   (and `/gjuha/it`, `/gjuha/de`, `/gjuha/es` to Italian, German and Spanish); the builder
   shows the extra "Letter" step.
5. `https://cv.saiddulevic.com/admin/register` returns 404.
6. `https://cv.saiddulevic.com/.env` and `/vendor/` are not reachable (the document root
   is `public/`).
7. `tail -f storage/logs/laravel.log` shows no errors while browsing.

## Updating a running site (safe procedure)

`APP_KEY`, administrator accounts and site settings live in `.env` and the database;
none of the steps below touch them.

```bash
cd ~/apps/krijo-cv
php artisan down --retry=30
git pull                                   # or upload the new files, keeping .env
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force                # only applies new migrations
php artisan db:seed --force                # adds new defaults, never overwrites yours
php artisan optimize:clear
php artisan filament:optimize-clear
php artisan optimize
php artisan filament:optimize
php artisan up
```

If the update changed front-end sources, rebuild or re-upload `public/build` as described
in step 10 before running `php artisan up`.

### Updating to the release with Word export, SEO pages and the installable app

* `robots.txt` is now generated by Laravel. If you upload files instead of using git,
  delete the old static file so Apache does not serve it instead:

  ```bash
  rm -f ~/cv.saiddulevic.com/public/robots.txt
  ```

* The new static files must be on the server: `public/sw.js`,
  `public/manifest.webmanifest`, `public/icons/` and `public/images/og/`.
* `public/.htaccess` declares the MIME types for `.mjs` and `.webmanifest` and asks
  browsers to revalidate `sw.js` (the header part needs `mod_headers`; without it the
  site still works).
* Check afterwards: `https://cv.saiddulevic.com/sitemap.xml` lists the pages,
  `https://cv.saiddulevic.com/cv-ne-anglisht` opens, and in the browser's developer tools
  (Application tab) the manifest and an active service worker appear.
* Submit `https://cv.saiddulevic.com/sitemap.xml` in Google Search Console once.

### Updating from the Albanian-only release (languages and cover letter)

The release that adds English/Italian and the cover letter needs nothing special beyond
the steps above, but note what the commands do:

* `php artisan migrate --force` adds the translation columns to `faqs` and `cv_templates`
  and appends two new FAQ entries (cover letter, languages) once.
* `php artisan db:seed --force` fills the English/Italian names, descriptions and FAQ
  texts of the shipped defaults. Anything you already wrote is left as it is.
* The new `lang/` directory and `config/krijo.php` must be present on the server, and
  `php artisan optimize:clear` must run before `optimize` so the new config is picked up.
* Optional: in the admin panel (Cilësimet e faqes) add your own English/Italian texts.

### Updating to the release with German and Spanish

* Upload the changed files (the update zip contains them) over the existing ones. New
  directories: `lang/de`, `lang/es`, `database/seeders/data`.
* Open the terminal in cPanel and **change into the folder that contains `artisan`** before
  running anything (a new terminal starts in your home folder, where `artisan` does not
  exist). For this site that folder is `~/cv.saiddulevic.com`:

```bash
cd ~/cv.saiddulevic.com
ls artisan                       # must print "artisan"; if not, you are in the wrong folder
php artisan migrate --force
php artisan db:seed --force
php artisan optimize:clear
php artisan optimize
```

* `migrate` adds the German/Spanish columns to `faqs` and `cv_templates` and updates the
  "which languages" FAQ answer, but only where it still has the original wording.
* `db:seed` fills the German/Spanish FAQ and template texts that are empty. Texts you
  edited are never overwritten.
* `optimize:clear` followed by `optimize` makes the new language list in
  `config/krijo.php` take effect. Old hashed files left in `public/build` are harmless.
* If `php -v` shows a version lower than 8.3, call PHP by its full path instead, for
  example `/opt/cpanel/ea-php83/root/usr/bin/php artisan migrate --force`.
* Check `https://cv.saiddulevic.com/?lang=de`, `?lang=es` and `/sitemap.xml`.

### Linking the public source code

After the repository is published, open **/admin → Cilësimet e faqes → Kodi burimor
(open source)** and paste its address. A "Source code" link then appears in the footer and a
section with the link appears on the privacy page. Leave the field empty to hide both.

Do **not** run `php artisan key:generate`, `migrate:fresh`, `migrate:reset` or
`db:wipe` on the production site.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| "500 Server Error" right after upload | Check `storage/logs/laravel.log`; usually a missing `APP_KEY` (step 7) or unwritable `storage/` (step 11). |
| Unstyled admin panel | Run `php artisan filament:assets` (or `composer install` again) so `public/css/filament` and `public/js/filament` exist. |
| "Unable to locate file in Vite manifest" | `public/build` is missing or stale; redo step 10 and remove `public/hot` if present. |
| Builder loads but the preview never appears | Confirm `public/build/assets/pdfmake-*.js`, `pdf-*.js`, `pdf.worker.min-*.mjs` and `public/fonts/inter/*.ttf` return 200 over HTTPS. |
| Admin login works locally but not on the server | `SESSION_DRIVER=database` needs the `sessions` table (migrations) and `APP_URL` must use the real `https://` host. |
| Composer error about memory | `COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --optimize-autoloader` |
