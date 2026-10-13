import Alpine from 'alpinejs';
import { cvBuilder } from './builder/builder.js';
import { photoCropper } from './builder/cropper.js';
import { KEYS, storageGet } from './cv/storage.js';

/**
 * Homepage helper: shows "Vazhdo CV-në" when an autosaved project exists on
 * this device.
 */
function homeResume() {
    return {
        hasSaved: false,
        async init() {
            try {
                const [enabled, saved] = await Promise.all([storageGet(KEYS.autosave), storageGet(KEYS.project)]);
                this.hasSaved = enabled === true && Boolean(saved?.project);
            } catch {
                this.hasSaved = false;
            }
        },
    };
}

/**
 * Installable app: the browser's install prompt is kept until the visitor
 * presses "Instalo aplikacionin" in the footer.
 */
const pwa = {
    canInstall: false,
    deferred: null,
    async install() {
        if (!this.deferred) return;
        this.deferred.prompt();
        try {
            await this.deferred.userChoice;
        } finally {
            this.deferred = null;
            this.canInstall = false;
        }
    },
};

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    const store = Alpine.store('pwa') ?? pwa;
    store.deferred = event;
    store.canInstall = true;
});

window.addEventListener('appinstalled', () => {
    const store = Alpine.store('pwa') ?? pwa;
    store.deferred = null;
    store.canInstall = false;
});

const secureContext = window.location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(window.location.hostname);
if ('serviceWorker' in navigator && secureContext && !import.meta.env.DEV) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
            // Offline support is optional; the site works without it.
        });
    });
}

Alpine.store('pwa', pwa);
Alpine.data('cvBuilder', cvBuilder);
Alpine.data('photoCropper', photoCropper);
Alpine.data('homeResume', homeResume);

// Filament's Blade components register their Alpine plugins and data on
// `alpine:init`, so Alpine must be exposed globally before it starts.
window.Alpine = Alpine;
Alpine.start();
