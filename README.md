# ViRosh — A Cinematic Union (fan-concept recreation)

A React + Vite recreation inspired by the public ViRosh reference website. It includes the six chapter structure, editorial wedding styling, elapsed-time counter for 26 February 2026, photo reel/lightbox, horizontal ritual gallery, couple panels, archive grid, flip invitation ticket, responsive layout, reveal-on-scroll effects and back-to-top control.

## Run on Windows

1. Install Node.js LTS from https://nodejs.org/ (if not already installed).
2. Extract this ZIP.
3. Open the extracted `virosh-recreation` folder in VS Code.
4. Open Terminal → New Terminal.
5. Run:

   ```powershell
   npm install
   npm run dev
   ```

6. Open the local URL Vite prints (normally http://localhost:5173).

To make a production build:

```powershell
npm run build
npm run preview
```

## Images and rights

The image URLs in `src.jsx` point to image files currently served by the public reference website. They are loaded remotely, so internet access is required and the original host must continue serving them. This project does not include copies of those photographs. Please obtain permission from the relevant rights holders before republishing or redistributing the photographs. The original page identifies itself as an independent fan concept and says it is not affiliated with or endorsed by the people featured.

If you have permission and want local/offline images, download the permitted image files into `public/images/`, then replace the `https://vijay-rashmika.netlify.app/images/...` values in `src.jsx` with `/images/filename.jpg`.

## Notes

- The reference page's music control does not expose a downloadable audio track in the page text. This recreation keeps a visible music control state but does not fabricate or bundle music.
- The displayed date is in the past relative to October 2026, so the timer counts elapsed time since 26 February 2026 rather than counting down to it.
- This is an independent recreation, not the original source code and not an official Vijay/Rashmika site.
