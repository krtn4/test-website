/**
 * Image optimiser — run with `npm run images` (also runs automatically
 * before `npm run dev` and `npm run build`).
 *
 * For every photo in public/images/ it creates:
 *   - WebP versions at 480 / 960 / 1600 px wide in public/images/optimized/
 *   - a tiny blurred placeholder shown while the photo loads
 * and records sizes in src/data/imageManifest.json, which the website
 * reads to serve the right size to each screen.
 *
 * Photos that are already up to date are skipped, so re-running is fast.
 * To use new photos: copy them into public/images/ and reference the file
 * name in src/data/gallery.js — nothing else is needed.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = path.join(root, 'public', 'images');
const OUTPUT_DIR = path.join(SOURCE_DIR, 'optimized');
const MANIFEST = path.join(root, 'src', 'data', 'imageManifest.json');

const WIDTHS = [480, 960, 1600];
const QUALITY = 78;
const SOURCE_TYPES = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);

const isNewer = async (output, source) => {
  try {
    const [out, src] = await Promise.all([fs.stat(output), fs.stat(source)]);
    return out.mtimeMs >= src.mtimeMs;
  } catch {
    return false;
  }
};

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const previous = await readManifest();
  const manifest = {};
  const keepOutputs = new Set();
  let processed = 0;

  const files = (await fs.readdir(SOURCE_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && SOURCE_TYPES.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort();

  for (const file of files) {
    const source = path.join(SOURCE_DIR, file);
    const base = path.parse(file).name;
    // autoOrient applies EXIF rotation so phone photos are never sideways.
    const meta = await sharp(source).autoOrient().metadata();
    const width = meta.autoOrient?.width ?? meta.width;
    const height = meta.autoOrient?.height ?? meta.height;

    const targets = WIDTHS.filter((w) => w < width);
    if (targets.length < WIDTHS.length) targets.push(Math.min(width, WIDTHS.at(-1)));

    const variants = [];
    let changed = false;
    for (const w of [...new Set(targets)]) {
      const name = `${base}-${w}.webp`;
      const output = path.join(OUTPUT_DIR, name);
      keepOutputs.add(name);
      if (!(await isNewer(output, source))) {
        await sharp(source)
          .autoOrient()
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(output);
        changed = true;
      }
      variants.push({ width: w, file: `optimized/${name}` });
    }

    let placeholder = previous[file]?.placeholder;
    if (changed || !placeholder) {
      const tiny = await sharp(source).autoOrient().resize({ width: 16 }).blur(1.2).webp({ quality: 40 }).toBuffer();
      placeholder = `data:image/webp;base64,${tiny.toString('base64')}`;
    }

    manifest[file] = { width, height, placeholder, variants };
    if (changed) processed += 1;
  }

  // Remove generated files whose source photo was deleted or renamed.
  for (const name of await fs.readdir(OUTPUT_DIR)) {
    if (!keepOutputs.has(name)) await fs.rm(path.join(OUTPUT_DIR, name));
  }

  const json = `${JSON.stringify(manifest, null, 2)}\n`;
  const old = await fs.readFile(MANIFEST, 'utf8').catch(() => '');
  if (json !== old) await fs.writeFile(MANIFEST, json);

  console.log(
    `[images] ${files.length} photos · ${processed} optimised · ${files.length - processed} already up to date`,
  );
}

main().catch((error) => {
  console.error('[images] Optimisation failed:', error.message);
  process.exit(1);
});
