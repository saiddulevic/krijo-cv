/**
 * PDF preview rendered with PDF.js from the very same PDF bytes the visitor
 * downloads. Rendering is sequenced: a newer request always wins, older
 * documents are destroyed and in-flight page renders are cancelled.
 */

let pdfjsPromise = null;
let sharedWorker = null;

function loadPdfjs() {
    if (!pdfjsPromise) {
        pdfjsPromise = Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')])
            .then(([pdfjs, worker]) => {
                pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
                return pdfjs;
            })
            .catch((error) => {
                pdfjsPromise = null;
                throw error;
            });
    }
    return pdfjsPromise;
}

/** One worker is reused for every preview render instead of spawning one per document. */
function getWorker(pdfjs) {
    if (!sharedWorker || sharedWorker.destroyed) {
        sharedWorker = new pdfjs.PDFWorker({ name: 'krijo-cv-preview' });
    }
    return sharedWorker;
}

export function createPreview(container) {
    let sequence = 0;
    let loadingTask = null;
    let renderTasks = [];

    const cancelRenders = () => {
        for (const task of renderTasks) {
            try {
                task.cancel();
            } catch {
                // ignore
            }
        }
        renderTasks = [];
    };

    const destroyDocument = () => {
        if (loadingTask) {
            const old = loadingTask;
            loadingTask = null;
            old.destroy().catch(() => {});
        }
    };

    return {
        /**
         * @param {Blob} blob
         * @param {{ width: number, pageLabel?: (n: number, total: number) => string }} options CSS pixel width of a page
         * @returns {Promise<{ pages: number } | null>} null when superseded
         */
        async render(blob, { width, pageLabel }) {
            const mine = ++sequence;
            const isCurrent = () => mine === sequence;

            const bytes = new Uint8Array(await blob.arrayBuffer());
            if (!isCurrent()) return null;

            const pdfjs = await loadPdfjs();
            if (!isCurrent()) return null;

            cancelRenders();
            destroyDocument();

            const task = pdfjs.getDocument({ data: bytes, worker: getWorker(pdfjs), isEvalSupported: false, useSystemFonts: false });
            loadingTask = task;
            const doc = await task.promise;
            if (!isCurrent()) {
                task.destroy().catch(() => {});
                return null;
            }

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const fragment = document.createDocumentFragment();

            for (let number = 1; number <= doc.numPages; number += 1) {
                const page = await doc.getPage(number);
                if (!isCurrent()) return null;
                const base = page.getViewport({ scale: 1 });
                const scale = width / base.width;
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.className = 'preview-page';
                canvas.width = Math.floor(viewport.width * dpr);
                canvas.height = Math.floor(viewport.height * dpr);
                canvas.style.width = `${Math.floor(viewport.width)}px`;
                canvas.style.height = `${Math.floor(viewport.height)}px`;
                canvas.setAttribute('role', 'img');
                canvas.setAttribute('aria-label', typeof pageLabel === 'function' ? pageLabel(number, doc.numPages) : `${number} / ${doc.numPages}`);
                const context = canvas.getContext('2d', { alpha: false });
                const renderTask = page.render({
                    canvasContext: context,
                    canvas,
                    viewport,
                    transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
                });
                renderTasks.push(renderTask);
                try {
                    await renderTask.promise;
                } catch (error) {
                    if (error?.name === 'RenderingCancelledException') return null;
                    throw error;
                }
                if (!isCurrent()) return null;
                fragment.appendChild(canvas);
            }

            renderTasks = [];
            container.replaceChildren(fragment);
            return { pages: doc.numPages };
        },

        destroy() {
            sequence += 1;
            cancelRenders();
            destroyDocument();
            container.replaceChildren();
        },
    };
}
