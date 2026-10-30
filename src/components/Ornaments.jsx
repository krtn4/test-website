/**
 * Hand-drawn SVG ornaments in a temple-gold line style.
 * `pathLength="1"` on strokes lets CSS animate them "drawing" in.
 */

const LOTUS_PETALS = Array.from({ length: 12 }, (_, i) => i * 30);
const INNER_PETALS = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);

export function LotusMandala({ className = '' }) {
  return (
    <svg className={`ornament-lotus ${className}`} viewBox="-120 -120 240 240" aria-hidden="true">
      <circle r="112" pathLength="1" />
      <circle r="104" pathLength="1" strokeDasharray="0.004 0.012" />
      {LOTUS_PETALS.map((deg) => (
        <path
          key={deg}
          transform={`rotate(${deg})`}
          d="M0 -40 C 14 -58, 16 -80, 0 -98 C -16 -80, -14 -58, 0 -40 Z"
          pathLength="1"
        />
      ))}
      {INNER_PETALS.map((deg) => (
        <path
          key={deg}
          transform={`rotate(${deg})`}
          d="M0 -18 C 9 -26, 10 -38, 0 -50 C -10 -38, -9 -26, 0 -18 Z"
          pathLength="1"
        />
      ))}
      <circle r="16" pathLength="1" />
      <circle r="4" className="fill" />
    </svg>
  );
}

/** Cusped temple arch used to frame the hero title. */
export function TempleArch({ className = '' }) {
  return (
    <svg className={`ornament-arch ${className}`} viewBox="0 0 400 560" preserveAspectRatio="none" aria-hidden="true">
      <path
        pathLength="1"
        d="M10 560 V250 C10 200 40 180 60 160 C70 120 110 110 130 90 C150 60 180 50 200 10 C220 50 250 60 270 90 C290 110 330 120 340 160 C360 180 390 200 390 250 V560"
      />
      <path
        pathLength="1"
        className="thin"
        d="M28 560 V256 C28 214 54 196 72 178 C82 140 118 130 138 110 C158 82 184 70 200 38 C216 70 242 82 262 110 C282 130 318 140 328 178 C346 196 372 214 372 256 V560"
      />
      <circle cx="200" cy="10" r="4" className="fill" />
    </svg>
  );
}

export function Divider({ className = '' }) {
  return (
    <span className={`ornament-divider ${className}`} aria-hidden="true">
      <i />
      <svg viewBox="0 0 24 24">
        <path d="M12 2 L15 12 L12 22 L9 12 Z" />
        <circle cx="12" cy="12" r="1.6" />
      </svg>
      <i />
    </span>
  );
}

/** Corner flourish for cards and panels. */
export function CornerFlourish({ className = '' }) {
  return (
    <svg className={`ornament-corner ${className}`} viewBox="0 0 60 60" aria-hidden="true">
      <path d="M2 58 V18 C2 9 9 2 18 2 H58" />
      <path d="M10 58 V24 C10 16 16 10 24 10 H58" className="thin" />
      <circle cx="18" cy="18" r="2.5" />
    </svg>
  );
}
