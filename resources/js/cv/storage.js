/**
 * Minimal IndexedDB key/value store used for the optional on-device autosave.
 * Every function resolves gracefully when storage is unavailable (private
 * windows, blocked storage, old browsers): the builder keeps working without it.
 */

const DB_NAME = 'krijo-cv';
const DB_VERSION = 1;
const STORE = 'kv';

export const KEYS = {
    project: 'project',
    autosave: 'autosave-enabled',
};

let dbPromise = null;

function openDatabase() {
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
        try {
            if (typeof indexedDB === 'undefined') {
                reject(new Error('IndexedDB is not available'));
                return;
            }
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE)) {
                    db.createObjectStore(STORE);
                }
            };
            request.onsuccess = () => {
                const db = request.result;
                db.onversionchange = () => db.close();
                resolve(db);
            };
            request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
            request.onblocked = () => reject(new Error('IndexedDB open blocked'));
        } catch (error) {
            reject(error);
        }
    });

    dbPromise.catch(() => {
        dbPromise = null;
    });

    return dbPromise;
}

function run(mode, operation) {
    return openDatabase().then(
        (db) =>
            new Promise((resolve, reject) => {
                let request;
                try {
                    const tx = db.transaction(STORE, mode);
                    const store = tx.objectStore(STORE);
                    request = operation(store);
                    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
                    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
                    tx.oncomplete = () => resolve(request ? request.result : undefined);
                } catch (error) {
                    reject(error);
                }
            }),
    );
}

/** Resolves true when IndexedDB can be opened and written to. */
export async function isStorageAvailable() {
    try {
        await run('readonly', (store) => store.count());
        return true;
    } catch {
        return false;
    }
}

export async function storageGet(key) {
    try {
        return await run('readonly', (store) => store.get(key));
    } catch {
        return undefined;
    }
}

export async function storageSet(key, value) {
    await run('readwrite', (store) => store.put(value, key));
}

export async function storageDelete(key) {
    await run('readwrite', (store) => store.delete(key));
}

export async function storageClear() {
    await run('readwrite', (store) => store.clear());
}
