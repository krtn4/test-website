import { weddingConfig } from '../data/weddingConfig.js';

const LOGO_SIZE = { width: 1080, height: 310 };

/** Developer logo (falls back to the studio name when no logo is set). */
export function DeveloperLogo({ className = '' }) {
  const { developer } = weddingConfig;
  if (!developer.logo) return <span className={`dev-name ${className}`}>{developer.name}</span>;

  return (
    <img
      className={`dev-logo ${className}`}
      src={`${import.meta.env.BASE_URL}${developer.logo}`}
      alt={`${developer.name} — ${developer.tagline}`}
      width={LOGO_SIZE.width}
      height={LOGO_SIZE.height}
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  );
}

/** Instagram glyph — inline so it doesn't depend on deprecated icon-set brand icons. */
export function InstagramIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
