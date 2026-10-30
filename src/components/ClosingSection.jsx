import { useRef } from 'react';
import { siteContent } from '../data/siteContent.js';
import { weddingConfig } from '../data/weddingConfig.js';
import { sectionImages } from '../data/gallery.js';
import { useReducedMotion } from '../hooks/useMediaQuery.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { PetalCanvas } from './PetalCanvas.jsx';
import { SmartImage } from './SmartImage.jsx';

/** Final cinematic frame — the couple walking into forever. */
export function ClosingSection() {
  const { couple, credits } = weddingConfig;
  const text = siteContent.closing;
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  useScrollProgress(ref, { disabled: reducedMotion });

  return (
    <section ref={ref} className="closing" aria-labelledby="closing-title">
      <div className="closing-photo">
        <SmartImage photo={sectionImages.closing} sizes="100vw" />
      </div>
      <div className="closing-shade" aria-hidden="true" />
      <PetalCanvas petals={16} sparks={30} className="closing-petals" />

      <div className="closing-copy reveal">
        <p className="eyebrow">{couple.hashtag}</p>
        <h2 id="closing-title">
          {text.lines.map((line, i) => (
            <span key={line} style={{ display: 'block' }}>
              {i === text.accentLine ? <em>{line}</em> : line}
            </span>
          ))}
        </h2>
        {credits.dedication && <p className="closing-dedication">{credits.dedication}</p>}
      </div>

      <div className="closing-bottom">
        <span>
          © {text.year} · {couple.hashtag.replace('#', '')}
        </span>
        {text.note && <span>{text.note}</span>}
        {credits.conceptBy && (
          <a href={credits.conceptUrl || undefined} target="_blank" rel="noreferrer">
            {credits.label} {credits.conceptBy} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </section>
  );
}
