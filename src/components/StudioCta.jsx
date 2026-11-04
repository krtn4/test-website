import { weddingConfig } from '../data/weddingConfig.js';
import { DeveloperLogo, InstagramIcon } from './DeveloperMark.jsx';

/**
 * Small studio strip after the closing section: a one-line prompt,
 * the developer logo and the Instagram contact.
 */
export function StudioCta() {
  const { studioCta, developer } = weddingConfig;
  if (!studioCta.enabled) return null;

  return (
    <aside className="studio-cta" aria-labelledby="studio-cta-title">
      <div className="studio-inner reveal">
        <a
          className="studio-brand"
          href={developer.instagramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${developer.name} on Instagram`}
        >
          <DeveloperLogo />
        </a>
        <div className="studio-text">
          <h2 id="studio-cta-title">{studioCta.heading}</h2>
          {developer.instagram && (
            <p className="studio-note">
              {studioCta.contactPrefix}{' '}
              <a className="studio-handle" href={developer.instagramUrl} target="_blank" rel="noreferrer">
                <InstagramIcon size={15} /> @{developer.instagram}
              </a>
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
