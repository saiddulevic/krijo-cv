/**
 * Generates the app icons (public/icons) and the social sharing images
 * (public/images/og/og-<locale>.png, 1200×630) from code, using the site's
 * own Inter font and the template thumbnails.
 *
 *   node scripts/make-brand-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ensureDir, getCanvas } from './pdf-node.mjs';

const { createCanvas, GlobalFonts, loadImage } = getCanvas();
const BRAND = '#C1121F';
const INK = '#111827';
const MUTED = '#4B5563';

GlobalFonts.registerFromPath(path.join(ROOT, 'public/fonts/inter/Inter-Bold.ttf'), 'InterBold');
GlobalFonts.registerFromPath(path.join(ROOT, 'public/fonts/inter/Inter-SemiBold.ttf'), 'InterSemi');
GlobalFonts.registerFromPath(path.join(ROOT, 'public/fonts/inter/Inter-Regular.ttf'), 'InterRegular');

function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

/** Largest font size (down to 24 px) at which every text fits in maxWidth. */
function fitSize(ctx, texts, family, start, maxWidth) {
    let size = start;
    while (size > 24) {
        ctx.font = `${size}px ${family}`;
        if (texts.every((text) => ctx.measureText(text).width <= maxWidth)) break;
        size -= 2;
    }
    return size;
}

/** "CV" mark: white letters on the brand colour. */
function drawMark(ctx, x, y, size, radius) {
    ctx.fillStyle = BRAND;
    roundedRect(ctx, x, y, size, size, radius);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${Math.round(size * 0.42)}px InterBold`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CV', x + size / 2, y + size / 2 + size * 0.02);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
}

function icon(size, { maskable = false } = {}) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    if (maskable) {
        // Full-bleed background; the mark stays inside the 80% safe zone.
        ctx.fillStyle = BRAND;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${Math.round(size * 0.3)}px InterBold`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CV', size / 2, size / 2 + size * 0.015);
    } else {
        drawMark(ctx, 0, 0, size, size * 0.22);
    }
    return canvas.toBuffer('image/png');
}

const OG_TEXT = {
    sq: { title: ['CV-ja jote,', 'gati për aplikim.'], line: 'Falas · Pa regjistrim · 5 gjuhë' },
    en: { title: ['Your CV,', 'ready to apply.'], line: 'Free · No sign-up · 5 languages' },
    it: { title: ['Il tuo CV,', 'pronto per candidarti.'], line: 'Gratis · Senza registrazione · 5 lingue' },
    de: { title: ['Dein Lebenslauf,', 'bereit zur Bewerbung.'], line: 'Kostenlos · Ohne Anmeldung · 5 Sprachen' },
    es: { title: ['Tu CV,', 'listo para postularte.'], line: 'Gratis · Sin registro · 5 idiomas' },
};

async function ogImage(locale) {
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = BRAND;
    ctx.fillRect(0, height - 14, width, 14);

    // Logo
    drawMark(ctx, 72, 64, 64, 14);
    ctx.fillStyle = INK;
    ctx.font = '30px InterBold';
    ctx.fillText('SHQIP FALAS', 152, 108);

    // Headline
    const text = OG_TEXT[locale];
    const maxWidth = 620;
    ctx.fillStyle = INK;
    ctx.font = `${fitSize(ctx, text.title, 'InterBold', 68, maxWidth)}px InterBold`;
    ctx.fillText(text.title[0], 72, 262);
    ctx.fillText(text.title[1], 72, 344);
    ctx.fillStyle = MUTED;
    ctx.font = `${fitSize(ctx, [text.line], 'InterRegular', 28, maxWidth)}px InterRegular`;
    ctx.fillText(text.line, 72, 420);
    ctx.fillStyle = BRAND;
    ctx.font = '28px InterSemi';
    ctx.fillText('cv.saiddulevic.com', 72, 520);

    // Template thumbnails, fanned out on the right
    const thumbs = ['elegant', 'bold', 'timeline'];
    const placements = [
        { x: 742, y: 120, angle: -0.08 },
        { x: 902, y: 92, angle: 0.06 },
        { x: 822, y: 70, angle: 0 },
    ];
    for (const [index, slug] of thumbs.entries()) {
        const file = path.join(ROOT, 'public/images/templates', `${slug}.png`);
        if (!fs.existsSync(file)) continue;
        const image = await loadImage(fs.readFileSync(file));
        const w = 270;
        const h = Math.round((w * image.height) / image.width);
        const p = placements[index];
        ctx.save();
        ctx.translate(p.x + w / 2, p.y + h / 2);
        ctx.rotate(p.angle);
        ctx.shadowColor = 'rgba(17, 24, 39, 0.25)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 12;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.shadowColor = 'transparent';
        ctx.drawImage(image, -w / 2, -h / 2, w, h);
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 2;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
        ctx.restore();
    }

    return canvas.toBuffer('image/png');
}

const iconDir = path.join(ROOT, 'public/icons');
const ogDir = path.join(ROOT, 'public/images/og');
ensureDir(iconDir);
ensureDir(ogDir);

const outputs = {
    [path.join(iconDir, 'icon-192.png')]: icon(192),
    [path.join(iconDir, 'icon-512.png')]: icon(512),
    [path.join(iconDir, 'icon-maskable-512.png')]: icon(512, { maskable: true }),
    [path.join(iconDir, 'apple-touch-icon.png')]: icon(180, { maskable: true }),
};
for (const locale of Object.keys(OG_TEXT)) {
    outputs[path.join(ogDir, `og-${locale}.png`)] = await ogImage(locale);
}

for (const [file, buffer] of Object.entries(outputs)) {
    fs.writeFileSync(file, buffer);
    console.log(`${path.relative(ROOT, file)}  ${(buffer.length / 1024).toFixed(0)} KB`);
}
