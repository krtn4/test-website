import { useRef } from 'react';
import { sectionImages } from '../data/gallery.js';
import { siteContent } from '../data/siteContent.js';
import { useReducedMotion } from '../hooks/useMediaQuery.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { SmartImage } from './SmartImage.jsx';

/** Black-and-white full-bleed frame with a slow scroll parallax. */
export function CinemaInterlude() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const text = siteContent.interlude;
  useScrollProgress(ref, { disabled: reducedMotion });

  return (
    <section ref={ref} className="cinema" aria-label="Interlude">
      <div className="cinema-photo">
        <SmartImage photo={sectionImages.interlude} sizes="100vw" />
      </div>
      <div className="cinema-overlay" aria-hidden="true" />
      <span className="letterbox letterbox--top" aria-hidden="true" />
      <span className="letterbox letterbox--bottom" aria-hidden="true" />
      <blockquote className="cinema-quote reveal">
        <p>
          {text.quote}
          <br />
          <em>{text.quoteAccent}</em>
        </p>
        {text.signature && <footer>{text.signature}</footer>}
      </blockquote>
      {text.caption && <p className="cinema-caption">{text.caption}</p>}
    </section>
  );
}
