import { ArrowUpRight } from 'lucide-react';
import { weddingConfig } from '../data/weddingConfig.js';
import { LotusMandala } from './Ornaments.jsx';

/**
 * Showcase call-to-action. Visually and verbally separated from the
 * fan-concept invitation so it can't be mistaken for a celebrity service.
 */
export function StudioCta() {
  const { studioCta } = weddingConfig;
  if (!studioCta.enabled) return null;
  const hasUrl = Boolean(studioCta.url);

  return (
    <aside className="studio-cta" aria-labelledby="studio-cta-title">
      <LotusMandala className="studio-lotus" />
      <div className="studio-inner reveal">
        <p className="eyebrow">{studioCta.eyebrow}</p>
        <h2 id="studio-cta-title">{studioCta.heading}</h2>
        <p className="studio-body">{studioCta.body}</p>
        {hasUrl ? (
          <a className="btn btn--dark" href={studioCta.url} target="_blank" rel="noreferrer">
            {studioCta.buttonLabel} <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ) : (
          <>
            <button type="button" className="btn btn--dark" disabled aria-describedby="studio-cta-note">
              {studioCta.buttonLabel} <ArrowUpRight size={17} aria-hidden="true" />
            </button>
            <p className="studio-note" id="studio-cta-note">
              Contact link coming soon.
            </p>
          </>
        )}
        <p className="studio-separation">
          This showcase is a separate studio offering and has no connection to the couple featured above.
        </p>
      </div>
    </aside>
  );
}
