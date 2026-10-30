# Cinematic Wedding Website

A React + Vite cinematic wedding website: opening gate, layered 3D hero, countdown,
photo reel, couple portraits, ritual carousel, archive with full-screen gallery,
3D invitation card, venue & map, RSVP, background music and a closing frame.

Everything is self-contained — photographs, fonts and code all live in this folder.
Nothing is loaded from another website.

## Run

```powershell
npm install
npm run dev       # development server (usually http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build
```

Upload the contents of `dist/` to any static host (Netlify, Vercel, cPanel, S3…).

## Making a website for a new client

Almost everything is edited in three files inside `src/data/`:

| What | File |
| --- | --- |
| Names, hashtag, tagline, wedding date, event timings, venue address & map links, parking, contact, accommodation, RSVP form service, music file, studio call-to-action, footer credit, disclaimer | `src/data/weddingConfig.js` |
| All on-screen wording: section headings, descriptions, button labels, form labels, menu names — plus switches to turn any section on/off | `src/data/siteContent.js` |
| Photographs: file names, titles, descriptions, crop focus, and which photo appears in each section | `src/data/gallery.js` |

### Photos

1. Put the client's photos in `public/images/` (JPG, PNG or WebP).
2. Edit `src/data/gallery.js` — add an entry per photo and choose where each one appears
   (`reelIds`, `ritualIds`, `archive`, `sectionImages`).
3. Run `npm run dev` or `npm run build`. Optimised WebP versions (480 / 960 / 1600 px)
   and blur-up placeholders are generated automatically into `public/images/optimized/`
   (you can also run `npm run images` on its own). Never edit that folder by hand.

The archive grid is designed for exactly 8 photos and the reel for 6.

### Turning sections on or off

In `src/data/siteContent.js`, set `enabled: false` on any chapter (story, reel, couple,
rituals, archive, invitation, venue, rsvp), the opening `gate` or the `interlude`.
Chapter numbers, the menu and the hero counter update automatically.

### Venue & map

Fill in `venue` in `weddingConfig.js`. Until a name and address are entered, the site
honestly shows "Venue details coming soon". Add `mapsUrl` (a normal Google Maps share
link) for the Directions button, and optionally `embedUrl` (Google Maps → Share →
Embed a map → the `src` value) for the interactive map.

### RSVP

Set `rsvp.endpoint` to a form service that accepts JSON POST requests (for example
Formspree). Without it the form runs in clearly-labelled preview mode.

### Music

Place a licensed audio file in `public/audio/` and set `music.src` to e.g.
`/audio/theme.mp3`. Without a file, a gentle tanpura drone is generated in the browser.
Music never starts until the visitor chooses it.

### Also update for a new client

- `index.html` — the `<title>` and description used by link previews (the page title
  shown in the browser tab comes from `siteContent.js`).
- `public/favicon.svg` — the initials in the browser-tab icon.
- Colours and fonts — design tokens at the top of `src/styles/base.css`; font files in
  `public/fonts/` and `src/styles/fonts.css`.

## Project structure

```
public/
  images/            original photographs (+ optimized/ generated versions)
  fonts/             self-hosted web fonts
  favicon.svg
scripts/
  optimize-images.mjs
src/
  data/              weddingConfig.js · siteContent.js · gallery.js · imageManifest.json (generated)
  components/        one component per section and UI element
  hooks/             countdown, scroll reveal, 3D tilt, parallax helpers
  lib/audioEngine.js background music + generated ambient drone
  styles/            fonts, base tokens, and one stylesheet per area
```

## Notes

- The photographs are used with the rights holders' permission.
- Fonts (Cinzel, Cormorant Garamond, DM Sans) are licensed under the SIL Open Font License.
