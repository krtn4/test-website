import { useEffect, useRef } from 'react';
import { chapters, siteContent } from '../data/siteContent.js';
import { weddingConfig } from '../data/weddingConfig.js';
import { sectionImages } from '../data/gallery.js';
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { TempleArch } from './Ornaments.jsx';
import { PetalCanvas } from './PetalCanvas.jsx';
import { SmartImage } from './SmartImage.jsx';

/** Splits a word into individually animated letters (hidden from screen readers). */
const Letters = ({ text, offset = 0 }) =>
  [...text].map((char, i) => (
    <span key={i} className="letter" style={{ '--i': i + offset }} aria-hidden="true">
      {char}
    </span>
  ));

/**
 * Pointer parallax: the cursor position is smoothed with a lerp in a
 * requestAnimationFrame loop and written to --px / --py (-1 → 1).
 * Each layer multiplies those by its own depth in CSS, so the photo,
 * arch, light and title drift at different rates — a camera-like feel.
 */
function usePointerParallax(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const loop = () => {
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      el.style.setProperty('--px', x.toFixed(4));
      el.style.setProperty('--py', y.toFixed(4));
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.0005 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (event) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(loop);
    };
    el.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
    };
  }, [ref, enabled]);
}

export function Hero({ live }) {
  const { couple } = weddingConfig;
  const { hero } = siteContent;
  const heroRef = useRef(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();

  usePointerParallax(heroRef, finePointer && !reducedMotion);
  useScrollProgress(heroRef, { disabled: reducedMotion });

  return (
    <section ref={heroRef} className={`hero ${live ? 'is-live' : ''}`} id="top" aria-labelledby="hero-title">
      {/* Three wrappers so parallax, slow drift and the intro push-in each own a transform. */}
      <div className="hero-layer hero-photo">
        <div className="hero-drift">
          <SmartImage photo={sectionImages.hero} eager alt="" sizes="100vw" />
        </div>
      </div>
      <div className="hero-layer hero-shade" aria-hidden="true" />
      <div className="hero-layer hero-rays" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <PetalCanvas className="hero-layer" />
      <div className="hero-layer hero-arch" aria-hidden="true">
        <TempleArch />
      </div>

      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">
          <i /> {hero.eyebrow} <i />
        </p>
        <h1 id="hero-title" aria-label={`${couple.partnerOne} and ${couple.partnerTwo}`}>
          <span className="hero-line">
            <Letters text={couple.partnerOne} />
            <em className="hero-amp" aria-hidden="true">
              &amp;
            </em>
          </span>
          <span className="hero-line">
            <Letters text={couple.partnerTwo} offset={couple.partnerOne.length + 1} />
          </span>
        </h1>
        <p className="hero-sub">{couple.tagline}</p>
        <p className="hero-desc">{couple.description}</p>
        {chapters.length > 0 && (
          <a className="discover" href={`#${chapters[0].id}`}>
            {hero.ctaLabel} <span aria-hidden="true">↓</span>
          </a>
        )}
      </div>

      {chapters.length > 0 && (
        <div className="hero-index" aria-hidden="true">
          01 <span>/</span> {String(chapters.length).padStart(2, '0')}
        </div>
      )}
      {hero.verticalNote && (
        <div className="vertical-note" aria-hidden="true">
          {hero.verticalNote}
        </div>
      )}
      <div className="scroll-cue" aria-hidden="true">
        <i />
      </div>
    </section>
  );
}
