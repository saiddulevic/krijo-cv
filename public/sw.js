/*
 * Krijo CV service worker: makes the site installable and lets the builder
 * keep working without a connection after it has been used once online.
 *
 * It only caches this site's own pages and static files (scripts, styles,
 * fonts, images). Visitor CV data never travels over the network, so it is
 * never in this cache; it stays in the page and, if the visitor enables it,
 * in IndexedDB.
 */

const VERSION = 'v1';
const CACHE = `krijo-cv-${VERSION}`;
const SHELL = ['/', '/krijo', '/manifest.webmanifest', '/favicon.svg', '/icons/icon-192.png'];

const STATIC_PREFIXES = ['/build/', '/fonts/', '/images/', '/icons/', '/css/filament/', '/js/filament/'];
const NEVER_CACHE = [/^\/admin/, /^\/livewire/, /^\/gjuha\//, /^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/up$/];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE)
            .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' })))))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(keys.filter((key) => key.startsWith('krijo-cv-') && key !== CACHE).map((key) => caches.delete(key))))
            .then(() => self.clients.claim()),
    );
});

/** Hashed Vite file name without the hash, e.g. "/build/assets/app.js". */
function assetFamily(pathname) {
    const match = pathname.match(/^(\/build\/assets\/.+)-[A-Za-z0-9_-]{8,}(\.[a-z0-9]+)$/);
    return match ? match[1] + match[2] : null;
}

/** Removes older builds of the same asset so the cache does not grow forever. */
async function pruneFamily(cache, url) {
    const family = assetFamily(url.pathname);
    if (!family) return;
    const keys = await cache.keys();
    await Promise.all(
        keys
            .filter((request) => {
                const other = new URL(request.url);
                return other.pathname !== url.pathname && assetFamily(other.pathname) === family;
            })
            .map((request) => cache.delete(request)),
    );
}

async function cacheFirst(request) {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
        await pruneFamily(cache, new URL(request.url));
    }
    return response;
}

/** Serves the cached copy at once and refreshes it in the background (non-hashed files). */
async function staleWhileRevalidate(event, request) {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    const refresh = fetch(request)
        .then(async (response) => {
            if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
            return response;
        })
        .catch(() => null);
    if (cached) {
        event.waitUntil(refresh);
        return cached;
    }
    const response = await refresh;
    return response || Response.error();
}

async function networkFirst(request) {
    const cache = await caches.open(CACHE);
    try {
        const response = await fetch(request);
        if (response.ok && response.type === 'basic' && !response.redirected) {
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const url = new URL(request.url);
        const cached =
            (await cache.match(request)) ||
            (await cache.match(url.pathname)) ||
            (url.pathname.startsWith('/krijo') ? await cache.match('/krijo') : null) ||
            (await cache.match('/'));
        if (cached) return cached;
        throw error;
    }
}

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (NEVER_CACHE.some((pattern) => pattern.test(url.pathname))) return;

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    if (url.pathname.startsWith('/build/')) {
        event.respondWith(cacheFirst(request));
        return;
    }

    if (STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)) || url.pathname === '/favicon.svg' || url.pathname === '/manifest.webmanifest') {
        event.respondWith(staleWhileRevalidate(event, request));
    }
});
