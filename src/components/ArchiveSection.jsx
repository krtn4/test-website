import { useRef } from 'react';
import { archive, photos } from '../data/gallery.js';
import { chapterNumber, siteContent } from '../data/siteContent.js';
import { useReducedMotion } from '../hooks/useMediaQuery.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { ChapterIntro } from './ChapterLabel.jsx';
import { SmartImage } from './SmartImage.jsx';

/** Per-tile parallax depth in px across the section's scroll range. */
const DEPTHS = [-40, 30, 60, -20, 40, -50, 20, -30];

export function ArchiveSection({ onOpen }) {
  const chapter = { ...siteContent.archive, number: chapterNumber('archive') };
  const gridRef = useRef(null);
  const reducedMotion = useReducedMotion();
  useScrollProgress(gridRef, { disabled: reducedMotion });

  return (
    <section className="chapter archive" id="archive" aria-labelledby="archive-title">
      <ChapterIntro chapter={chapter} headingId="archive-title" />

      <div className="archive-grid" ref={gridRef}>
        {archive.map((id, i) => (
          <button
            type="button"
            key={id}
            className={`archive-tile a${i} reveal reveal--mask`}
            style={{ '--d': i % 3, '--depth': DEPTHS[i % DEPTHS.length] }}
            onClick={() => onOpen(id)}
            aria-label={photos[id].title}
          >
            <span className="archive-depth">
              <SmartImage photo={photos[id]} sizes="(max-width: 760px) 50vw, 40vw" />
            </span>
            <span className="archive-caption">
              {chapter.frameLabel} {String(i + 1).padStart(3, '0')} · {photos[id].title}
            </span>
          </button>
        ))}
      </div>

      <button type="button" className="btn btn--line archive-link" onClick={() => onOpen(archive[0])}>
        {chapter.buttonLabel} <span aria-hidden="true">↗</span>
      </button>
    </section>
  );
}
