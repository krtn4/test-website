import { useRef } from 'react';
import { siteContent } from '../data/siteContent.js';
import { weddingConfig } from '../data/weddingConfig.js';
import { sectionImages } from '../data/gallery.js';
import { useReducedMotion } from '../hooks/useMediaQuery.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { PetalCanvas } from './PetalCanvas.jsx';
import { SmartImage } from './SmartImage.jsx';
import { DeveloperLogo, InstagramIcon } from './DeveloperMark.jsx';

/** Final cinematic frame — the couple walking into forever. */
export function ClosingSection() {
  const { couple, credits, developer } = weddingConfig;
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
        <span className="closing-dev">
          <span>Designed &amp; developed by</span>
          <a href={developer.instagramUrl} target="_blank" rel="noreferrer" aria-label={`${developer.name} on Instagram (@${developer.instagram})`}>
            <DeveloperLogo className="dev-logo--footer" />
          </a>
          <a className="closing-dev-handle" href={developer.instagramUrl} target="_blank" rel="noreferrer">
            <InstagramIcon size={13} /> @{developer.instagram}
          </a>
        </span>
      </div>
    </section>
  );
}
