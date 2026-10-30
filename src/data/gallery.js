/**
 * ─────────────────────────────────────────────────────────────
 *  PHOTO LIBRARY — all photographs are stored locally.
 * ─────────────────────────────────────────────────────────────
 *
 * To use a new client's photographs:
 *   1. Copy the photos into  public/images/  (JPG, PNG or WebP).
 *   2. Update the entries below: file name, title, description (alt
 *      text for accessibility) and `focus`.
 *   3. Run `npm run dev` — fast WebP versions are generated automatically.
 *
 * `focus` is the CSS object-position used when a photo is cropped,
 * e.g. 'center 20%' keeps faces near the top in frame.
 *
 * The lists further down decide which photo appears in each section.
 */
import manifest from './imageManifest.json';

const IMAGE_DIR = `${import.meta.env.BASE_URL}images/`;

const photo = (file, title, alt, focus = 'center 30%') => {
  const info = manifest[file];
  return {
    file,
    src: IMAGE_DIR + file,
    title,
    alt,
    focus,
    width: info?.width ?? 1600,
    height: info?.height ?? 2000,
    placeholder: info?.placeholder,
    srcSet: info?.variants.map((v) => `${IMAGE_DIR}${v.file} ${v.width}w`).join(', '),
  };
};

export const photos = {
  arrival: photo(
    'arrival.jpg',
    'The Arrival',
    'The bride walks down a flower-lined aisle as the groom watches in the foreground',
    'center 40%',
  ),
  ceremony: photo(
    'ceremony.jpg',
    'The Ceremony',
    'The groom leans over the laughing bride during the ceremony as relatives look on',
    'center 45%',
  ),
  petals: photo(
    'petals.jpg',
    'Under Petals',
    'The couple kisses beneath hanging jasmine strands as petals and mist drift around them',
    'center 40%',
  ),
  forever: photo('forever.jpg', 'Forever', 'The couple in jasmine garlands, smiling at each other', 'center 25%'),
  celebration: photo(
    'celebration.jpg',
    'The Celebration',
    'The couple walks hand in hand down a carpeted aisle beneath a floral canopy, guests on either side',
    'center 45%',
  ),
  exit: photo('exit.jpg', 'The Exit', 'The couple walks away together down the aisle, seen from behind', 'center 45%'),
  intimate: photo('intimate.jpg', 'Intimate', 'Black-and-white frame of the couple in a close embrace', 'center 30%'),
  mantra: photo(
    'mantra.jpg',
    'The Mantra',
    'The groom, in red silk and gold jewellery, closes his eyes in prayer during a ritual',
    'center 20%',
  ),
  ritual: photo(
    'ritual.jpg',
    'The Ritual',
    'The couple laughs together beside a silver pot during a wedding ritual',
    'center 35%',
  ),
  joy: photo('joy.jpg', 'The Joy', 'The groom smiles broadly during a ritual, wearing a jasmine garland', 'center 25%'),
  bride: photo('bride.jpg', 'The Bride', 'The bride laughing, in gold temple jewellery and a sheer veil', 'center 20%'),
  touch: photo(
    'touch.jpg',
    'A Gentle Touch',
    'The couple rests their foreheads together, wearing rose and jasmine garlands',
    'center 25%',
  ),
  brideWalk: photo(
    'bride-walk.jpg',
    'Her Walk',
    'The bride walks in carrying a coconut, dressed in an orange and gold saree',
    'center 35%',
  ),
  blessing: photo(
    'blessing.jpg',
    'The Blessing',
    'The bride smiles as bangled hands reach toward her during a ritual',
    'center 35%',
  ),
  embrace: photo(
    'embrace.jpg',
    'The Embrace',
    'The couple shares a joyful embrace with a loved one in a yellow kurta',
    'center 30%',
  ),
};

// Each photo knows its own key, so sections can open it in the gallery.
for (const [id, entry] of Object.entries(photos)) entry.id = id;

/* ── Where each photo appears ───────────────────────────────── */

/** Full-screen gallery order (every photo listed here can be browsed). */
export const galleryOrder = [
  'arrival',
  'ceremony',
  'petals',
  'forever',
  'celebration',
  'exit',
  'intimate',
  'mantra',
  'ritual',
  'joy',
  'bride',
  'touch',
  'brideWalk',
  'blessing',
  'embrace',
];

/** The Reel — six frames, numbered FR·001 onward. */
export const reelIds = ['arrival', 'ceremony', 'petals', 'forever', 'celebration', 'exit'];

/** The Sacred Rituals rail. */
export const ritualIds = ['mantra', 'ritual', 'blessing', 'touch', 'joy'];

/** The Archive editorial grid (designed for exactly 8 photos). */
export const archive = ['arrival', 'ceremony', 'petals', 'intimate', 'celebration', 'bride', 'brideWalk', 'forever'];

/** Single photos used by individual sections. */
export const sectionImages = {
  hero: photos.celebration,
  interlude: photos.intimate,
  groom: photos.joy,
  bride: photos.bride,
  venue: photos.celebration,
  closing: photos.exit,
};

/* ── Derived data (no need to edit) ─────────────────────────── */

export const gallery = galleryOrder.map((id, index) => ({ id, index, ...photos[id] }));

export const galleryIndex = (id) => galleryOrder.indexOf(id);

export const reel = reelIds.map((id, i) => ({ id, frame: `FR·${String(i + 1).padStart(3, '0')}`, ...photos[id] }));

export const rituals = ritualIds.map((id) => ({ id, ...photos[id] }));

/** Ornamental image shown if a photograph fails to load. */
export const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520"><defs><radialGradient id="g" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#3a2416"/><stop offset="1" stop-color="#140d09"/></radialGradient></defs><rect width="400" height="520" fill="url(#g)"/><g fill="none" stroke="#c7a66b" stroke-opacity=".55"><path d="M120 400V230a80 80 0 0 1 160 0v170"/><path d="M140 400V236a60 60 0 0 1 120 0v164"/><circle cx="200" cy="170" r="6"/></g></svg>`,
  );
