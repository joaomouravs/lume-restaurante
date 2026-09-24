/**
 * Direção de arte: aplica o mesmo tratamento de cor a todas as fotos do site.
 *
 *   photos/originals/*.jpg|png  →  src/assets/images/  (mesmo nome)
 *
 * Receita "Lume": saturação contida, balanço quente, sombras âmbar,
 * contraste suave e vinheta. O grão de filme é aplicado via CSS
 * (não pesa nos arquivos). Uso: `npm run photos`
 *
 * Ajustes por foto ficam em OVERRIDES: brilho, vinheta e se a foto
 * deve receber o tratamento (recortes com transparência recebem só cor).
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

sharp.cache(false);

const SRC = 'photos/originals';
const OUT = 'src/assets/images';

const RECIPE = {
  saturation: 0.84,
  brightness: 0.97,
  contrast: 1.06, // multiplicador linear
  lift: -7, // deslocamento linear (afunda levemente os pretos)
  // Matriz de cor: aquece (↑vermelho, ↓azul) sem virar sépia
  warm: [
    [1.07, 0.03, 0.0],
    [0.01, 1.0, 0.0],
    [0.0, 0.03, 0.88],
  ],
  shadowTint: { r: 58, g: 34, b: 16, alpha: 0.28 }, // âmbar, em soft-light
  vignette: 0.42,
};

/** @type {Record<string, Partial<{ brightness: number; vignette: number; saturation: number }>>} */
const OVERRIDES = {
  'hero-plate.png': { vignette: 0 },
  'dish-salmon.jpg': { brightness: 0.92 },
};

const vignetteSvg = (w, h, strength) =>
  Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="v" cx="50%" cy="48%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="${strength}"/>
    </radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#v)"/></svg>`);

async function grade(file) {
  const input = path.join(SRC, file);
  const o = { ...RECIPE, ...OVERRIDES[file] };
  const isPng = file.endsWith('.png');
  const { width, height } = await sharp(input).metadata();

  // 1) Cor: saturação, brilho, contraste e balanço quente
  let img = sharp(input)
    .modulate({ saturation: o.saturation, brightness: o.brightness })
    .linear(o.contrast, o.lift)
    .recomb(o.warm);

  // 2) Tom âmbar nas sombras + vinheta
  const t = o.shadowTint;
  const tint = await sharp({
    create: { width, height, channels: 4, background: { r: t.r, g: t.g, b: t.b, alpha: t.alpha } },
  })
    .png()
    .toBuffer();

  const layers = [{ input: tint, blend: 'soft-light' }];
  if (o.vignette > 0) layers.push({ input: vignetteSvg(width, height, o.vignette), blend: 'multiply' });

  const graded = await img.toBuffer();
  let out = sharp(graded).composite(layers);

  if (isPng) {
    // Recortes: reaplica a transparência original sobre o resultado
    const alpha = await sharp(input).ensureAlpha().extractChannel('alpha').toBuffer();
    const rgb = await out.removeAlpha().toBuffer();
    out = sharp(rgb).joinChannel(alpha);
    fs.writeFileSync(path.join(OUT, file), await out.png({ compressionLevel: 9 }).toBuffer());
  } else {
    fs.writeFileSync(path.join(OUT, file), await out.jpeg({ quality: 88, mozjpeg: true }).toBuffer());
  }
}

fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f));
const only = process.argv.slice(2);
const targets = only.length ? files.filter((f) => only.includes(f)) : files;

const start = Date.now();
await Promise.all(targets.map(grade));
console.log(`✓ ${targets.length} fotos tratadas em ${((Date.now() - start) / 1000).toFixed(1)}s → ${OUT}`);
