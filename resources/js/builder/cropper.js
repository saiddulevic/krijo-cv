/**
 * Photo cropper component nested inside the builder's modal. Drag to
 * reposition (mouse, touch or pen), zoom with the slider, nudge with the
 * arrow keys. Everything is drawn on a canvas; nothing leaves the browser.
 */
import { clampCrop, coverScale, cropToSquare, defaultCrop, drawCrop, loadImageElement } from '../cv/photo.js';

export function photoCropper() {
    return {
        img: null,
        crop: null,
        zoom: 1,
        loading: false,
        error: '',
        dragging: false,
        _last: null,
        _size: 280,

        init() {
            this.$watch('cropper.open', (open) => {
                if (open) {
                    this.load();
                } else {
                    this.unload();
                }
            });
            if (this.cropper.open) this.load();
        },

        async load() {
            this.loading = true;
            this.error = '';
            try {
                this.img = await loadImageElement(this.cropper.source);
                const { naturalWidth: w, naturalHeight: h } = this.img;
                this.crop = this.cropper.crop ? clampCrop(this.cropper.crop, w, h) : defaultCrop(w, h);
                this.zoom = this.crop.zoom;
                this.$nextTick(() => this.draw());
            } catch {
                this.error = typeof this.t === 'function' ? this.t('photo_open_failed') : 'Photo cannot be opened.';
            } finally {
                this.loading = false;
            }
        },

        unload() {
            this.img = null;
            this.crop = null;
        },

        viewportSize() {
            const canvas = this.$refs.canvas;
            const rect = canvas?.getBoundingClientRect();
            return rect && rect.width > 0 ? rect.width : this._size;
        },

        draw() {
            const canvas = this.$refs.canvas;
            if (!canvas || !this.img || !this.crop) return;
            const size = Math.round(this.viewportSize());
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const pixels = Math.round(size * dpr);
            if (canvas.width !== pixels) {
                canvas.width = pixels;
                canvas.height = pixels;
            }
            drawCrop(canvas.getContext('2d'), this.img, this.crop, pixels);
        },

        setZoom(value) {
            if (!this.img || !this.crop) return;
            const { naturalWidth: w, naturalHeight: h } = this.img;
            const zoom = Math.min(8, Math.max(1, Number(value) || 1));
            const base = coverScale(w, h);
            const before = base * this.crop.zoom;
            const after = base * zoom;
            // Keep the point under the centre of the viewport fixed while zooming.
            const cx = (0.5 - this.crop.ox) / before;
            const cy = (0.5 - this.crop.oy) / before;
            this.crop = clampCrop({ zoom, ox: 0.5 - cx * after, oy: 0.5 - cy * after }, w, h);
            this.zoom = this.crop.zoom;
            this.draw();
        },

        pan(dx, dy) {
            if (!this.img || !this.crop) return;
            const { naturalWidth: w, naturalHeight: h } = this.img;
            this.crop = clampCrop({ zoom: this.crop.zoom, ox: this.crop.ox + dx, oy: this.crop.oy + dy }, w, h);
            this.draw();
        },

        pointerDown(event) {
            if (!this.img) return;
            this.dragging = true;
            this._last = { x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture?.(event.pointerId);
        },

        pointerMove(event) {
            if (!this.dragging || !this._last) return;
            const size = this.viewportSize();
            const dx = (event.clientX - this._last.x) / size;
            const dy = (event.clientY - this._last.y) / size;
            this._last = { x: event.clientX, y: event.clientY };
            this.pan(dx, dy);
        },

        pointerUp(event) {
            this.dragging = false;
            this._last = null;
            event.currentTarget.releasePointerCapture?.(event.pointerId);
        },

        onKey(event) {
            const step = 0.03;
            const map = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
            if (map[event.key]) {
                event.preventDefault();
                this.pan(...map[event.key]);
            } else if (event.key === '+' || event.key === '=') {
                event.preventDefault();
                this.setZoom(this.zoom + 0.1);
            } else if (event.key === '-') {
                event.preventDefault();
                this.setZoom(this.zoom - 0.1);
            }
        },

        reset() {
            if (!this.img) return;
            this.crop = defaultCrop(this.img.naturalWidth, this.img.naturalHeight);
            this.zoom = 1;
            this.draw();
        },

        apply() {
            if (!this.img || !this.crop) return;
            const data = cropToSquare(this.img, this.crop);
            this.applyCrop({ data, crop: { ...this.crop } });
        },
    };
}
