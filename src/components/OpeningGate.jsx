import { useEffect, useRef, useState } from 'react';
import { Music2 } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import { weddingConfig } from '../data/weddingConfig.js';
import { useReducedMotion } from '../hooks/useMediaQuery.js';
import { useTilt } from '../hooks/useTilt.js';
import { audioEngine } from '../lib/audioEngine.js';
import { CornerFlourish, Divider } from './Ornaments.jsx';
import { PetalCanvas } from './PetalCanvas.jsx';

/*
 * Opening timeline after "Open Invitation" (keep in sync with opening.css):
 *   0.0s  text fades away, the wax seal glows and breaks with a gold burst
 *   0.55s the envelope flap swings open in 3D
 *   1.1s  the invitation card slides up out of the envelope
 *   2.0s  the envelope drops away, the card settles in the centre
 *   2.7s  the card zooms toward the viewer and dissolves → website revealed
 *   3.6s  opening layer removed
 */
const REVEAL_AT = 2700;
const DONE_AT = 3650;

/**
 * Cinematic envelope opening shown on first load.
 * onEnter fires as the website starts to appear (hero animations begin);
 * onDone fires once the opening layer can be removed.
 */
export function OpeningGate({ onEnter, onDone }) {
  const { couple, dateLabel } = weddingConfig;
  const { gate, invitation } = siteContent;
  const [opening, setOpening] = useState(false);
  const buttonRef = useRef(null);
  const tiltRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const musicAvailable = audioEngine.getState().status !== 'unavailable';
  const initials = `${couple.partnerOne[0]}${couple.partnerTwo[0]}`;

  useTilt(tiltRef, { max: 7, disabled: opening });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('is-locked');
    buttonRef.current?.focus({ preventScroll: true });
    return () => root.classList.remove('is-locked');
  }, []);

  const open = (withMusic) => {
    if (opening) return;
    // play() must run synchronously inside the click for browser autoplay rules.
    if (withMusic) audioEngine.play();
    setOpening(true);
    window.setTimeout(onEnter, reducedMotion ? 0 : REVEAL_AT);
    window.setTimeout(onDone, reducedMotion ? 400 : DONE_AT);
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') open(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className={`og ${opening ? 'is-opening' : ''}`} role="dialog" aria-modal="true" aria-labelledby="og-title">
      <div className="og-backdrop" aria-hidden="true">
        <PetalCanvas petals={10} sparks={46} />
      </div>
      <div className="og-flash" aria-hidden="true" />

      <div className="og-content">
        <header className="og-head">
          <p className="og-hashtag">{couple.hashtag}</p>
          <h1 id="og-title" className="og-title">
            <span>{couple.partnerOne}</span>
            <em>×</em>
            <span>{couple.partnerTwo}</span>
          </h1>
          <p className="og-sub">
            {gate.subtitle} · {dateLabel}
          </p>
        </header>

        <div className="og-float">
          <div className="og-glow" aria-hidden="true" />
          <div ref={tiltRef} className="og-tilt">
            {/* Envelope layers are siblings so the card can sit between back and pocket. */}
            <div className="og-stage" aria-hidden="true">
              <span className="og-back" />

              <span className="og-card">
                <span className="og-card-face">
                  <span className="og-card-border" />
                  <CornerFlourish className="og-corner tl" />
                  <CornerFlourish className="og-corner tr" />
                  <CornerFlourish className="og-corner bl" />
                  <CornerFlourish className="og-corner br" />
                  <span className="og-crest foil">
                    {couple.partnerOne[0]}
                    <i>✦</i>
                    {couple.partnerTwo[0]}
                  </span>
                  <span className="og-card-tag foil">{couple.hashtag}</span>
                  <span className="og-card-heading foil">
                    {invitation.cardHeading.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                  <Divider className="og-card-divider" />
                  <span className="og-card-names">
                    {couple.partnerOne} <i>×</i> {couple.partnerTwo}
                  </span>
                  <span className="og-card-date">{dateLabel}</span>
                  <span className="og-card-sheen" />
                </span>
              </span>

              <span className="og-pocket" />
              <span className="og-flap" />
              <span className="og-seal">
                <span>{initials}</span>
              </span>
              <span className="og-burst" />
            </div>
          </div>
        </div>

        <div className="og-actions">
          <button ref={buttonRef} type="button" className="btn btn--gold" onClick={() => open(false)}>
            {gate.enterLabel}
          </button>
          {musicAvailable && (
            <button type="button" className="btn btn--ghost" onClick={() => open(true)}>
              <Music2 size={16} aria-hidden="true" /> {gate.enterWithMusicLabel}
            </button>
          )}
        </div>
        {gate.note && <p className="og-note">{gate.note}</p>}
      </div>
    </div>
  );
}
