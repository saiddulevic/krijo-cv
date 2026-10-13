/**
 * Browser-side photo processing: validation, EXIF-aware decoding, downscaling,
 * square cropping and a circular variant for templates that need it. Nothing
 * here touches the network; the results are data URLs embedded in the project.
 */

export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const PHOTO_MAX_BYTES = 8 * 1024 * 1024;
export const OUTPUT_SIZE = 640; // px, square; ≈ 400 dpi at 40 mm print width
export const SOURCE_MAX = 1400; // px, longest side kept for re-cropping
const JPEG_QUALITY = 0.86;

/**
 * Returns null when the file is acceptable, otherwise a code the UI maps to a
 * message: 'none', 'type' or 'size'.
 */
export function checkPhotoFile(file) {
    if (!file) {
        return 'none';
    }
    const type = (file.type || '').toLowerCase();
    const name = (file.name || '').toLowerCase();
    const extensionOk = /\.(jpe?g|png|webp)$/.test(name);
    if (!PHOTO_TYPES.includes(type) && !extensionOk) {
        return 'type';
    }
    if (file.size > PHOTO_MAX_BYTES) {
        return 'size';
    }
    return null;
}

async function decodeFile(file) {
    if (typeof createImageBitmap === 'function') {
        try {
            return await createImageBitmap(file, { imageOrientation: 'from-image' });
        } catch {
            // fall through to the <img> path
        }
    }
    const url = URL.createObjectURL(file);
    try {
        return await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('decode failed'));
            img.src = url;
        });
    } finally {
        URL.revokeObjectURL(url);
    }
}

function makeCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

/**
 * Decodes an image file and returns a downscaled JPEG data URL that is kept in
 * the project so the visitor can re-crop later.
 */
export async function readImageFile(file) {
    const source = await decodeFile(file);
    const width = source.naturalWidth ?? source.width;
    const height = source.naturalHeight ?? source.height;
    if (!width || !height) {
        throw new Error('Image cannot be read.');
    }
    const ratio = Math.min(1, SOURCE_MAX / Math.max(width, height));
    const w = Math.max(1, Math.round(width * ratio));
    const h = Math.max(1, Math.round(height * ratio));
    const canvas = makeCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, w, h);
    if (typeof source.close === 'function') {
        source.close();
    }
    return { dataUrl: canvas.toDataURL('image/jpeg', 0.9), width: w, height: h };
}

export function loadImageElement(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Image cannot be read.'));
        img.src = dataUrl;
    });
}

/**
 * Crop geometry is normalised to a 1×1 viewport so it is independent of the
 * on-screen size: zoom ≥ 1 (1 = image covers the square), ox/oy = offset of
 * the image's top-left corner as a fraction of the viewport (always ≤ 0).
 */
export function coverScale(width, height) {
    return 1 / Math.min(width, height);
}

export function defaultCrop(width, height) {
    const s = coverScale(width, height);
    return { zoom: 1, ox: (1 - width * s) / 2, oy: (1 - height * s) / 2 };
}

export function clampCrop(crop, width, height) {
    const zoom = Math.min(8, Math.max(1, Number(crop.zoom) || 1));
    const s = coverScale(width, height) * zoom;
    const w = width * s;
    const h = height * s;
    const ox = Math.min(0, Math.max(1 - w, Number(crop.ox) || 0));
    const oy = Math.min(0, Math.max(1 - h, Number(crop.oy) || 0));
    return { zoom, ox, oy };
}

/** Draws the current crop into a square canvas of the given pixel size. */
export function drawCrop(ctx, img, crop, size) {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const c = clampCrop(crop, width, height);
    const s = coverScale(width, height) * c.zoom;
    const sx = -c.ox / s;
    const sy = -c.oy / s;
    const sw = 1 / s;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, sw, sw, 0, 0, size, size);
}

export function cropToSquare(img, crop, size = OUTPUT_SIZE) {
    const canvas = makeCanvas(size, size);
    drawCrop(canvas.getContext('2d'), img, crop, size);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

/** Circular PNG variant (transparent corners) for templates with round photos. */
export async function makeRoundPng(dataUrl, size = 480) {
    const img = await loadImageElement(dataUrl);
    const canvas = makeCanvas(size, size);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, size, size);
    return canvas.toDataURL('image/png');
}
