import { useRef, useState } from 'react';
import { chapterNumber, siteContent } from '../data/siteContent.js';
import { hasVenueDetails, weddingConfig } from '../data/weddingConfig.js';
import { useFinePointer } from '../hooks/useMediaQuery.js';
import { useInView } from '../hooks/useInView.js';
import { useTilt } from '../hooks/useTilt.js';
import { ChapterLabel } from './ChapterLabel.jsx';
import { CornerFlourish, Divider } from './Ornaments.jsx';

/**
 * Luxury invitation card.
 *
 * Opening sequence (CSS, triggered once when scrolled into view):
 * the envelope flap lifts, the card rises out and the envelope sinks away.
 * After that the card tilts toward the pointer (with a moving foil
 * highlight) and flips in 3D on click, tap, Enter or Space.
 */
export function InvitationSection() {
  const { couple, dateLabel, events, venue } = weddingConfig;
  const { ui } = siteContent;
  const text = siteContent.invitation;
  const [flipped, setFlipped] = useState(false);
  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const opened = useInView(stageRef, { threshold: 0.35, once: true });
  const finePointer = useFinePointer();
  useTilt(tiltRef, { max: 9, disabled: !opened });

  const initials = `${couple.partnerOne[0]}${couple.partnerTwo[0]}`;
  const venueReady = hasVenueDetails(venue);

  return (
    <section className="chapter invitation" id="invitation" aria-labelledby="invitation-title">
      <ChapterLabel number={chapterNumber('invitation')} title={text.chapterTitle} />
      <div className="invitation-head reveal">
        <p className="eyebrow">{text.eyebrow}</p>
        <h2 id="invitation-title">
          {text.title} <em>{text.accent}</em>
        </h2>
        <p className="invite-hint">{finePointer ? ui.clickHint : ui.tapHint}</p>
      </div>

      <div ref={stageRef} className={`envelope-stage ${opened ? 'is-open' : ''}`}>
        <div className="envelope" aria-hidden="true">
          <span className="envelope-back" />
          <span className="envelope-flap" />
          <span className="envelope-pocket" />
          <span className="envelope-seal">{initials}</span>
        </div>

        {/* .invite-tilt rises out of the envelope, .invite-tilt-layer follows the pointer, the button flips. */}
        <div ref={tiltRef} className="invite-tilt">
          <div className="invite-tilt-layer">
            <button
              type="button"
              className={`invite-card ${flipped ? 'is-flipped' : ''}`}
              onClick={() => setFlipped((value) => !value)}
              aria-pressed={flipped}
              aria-label={`${text.chapterTitle} — ${flipped ? ui.showingDetails : ui.showingFront}`}
            >
              {/* ── Front: burgundy velvet with gold foil ── */}
              <span className="invite-face invite-front">
                <span className="invite-border" aria-hidden="true" />
                <CornerFlourish className="invite-corner tl" />
                <CornerFlourish className="invite-corner tr" />
                <CornerFlourish className="invite-corner bl" />
                <CornerFlourish className="invite-corner br" />
                <span className="invite-crest foil" aria-hidden="true">
                  {couple.partnerOne[0]}
                  <i>✦</i>
                  {couple.partnerTwo[0]}
                </span>
                <span className="invite-tag foil">{couple.hashtag}</span>
                <span className="invite-heading foil">
                  {text.cardHeading.map((line, i) => (
                    <span key={line} style={{ display: 'block' }}>
                      {line}
                      {i < text.cardHeading.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </span>
                <Divider className="invite-divider" />
                <span className="invite-names">
                  {couple.partnerOne} <i>×</i> {couple.partnerTwo}
                </span>
                <span className="invite-date">{dateLabel}</span>
                {text.cardNumber && <span className="invite-number">{text.cardNumber}</span>}
                <span className="invite-light" aria-hidden="true" />
              </span>

              {/* ── Back: ivory paper with the details ── */}
              <span className="invite-face invite-back">
                <span className="invite-border" aria-hidden="true" />
                <span className="invite-tag">
                  {couple.hashtag}
                  {text.cardNumber && ` · ${text.cardNumber}`}
                </span>
                <span className="invite-verse">
                  {text.verse} <em>{text.verseAccent}</em>
                </span>
                <span className="invite-details">
                  <span>
                    <small>{text.labels.date}</small>
                    {dateLabel}
                  </span>
                  <span>
                    <small>{text.labels.venue}</small>
                    {venueReady ? venue.name : siteContent.venue.comingSoonTitle}
                    {venueReady && venue.city && <em>{[venue.city, venue.state].filter(Boolean).join(', ')}</em>}
                  </span>
                  <span>
                    <small>{text.labels.timings}</small>
                    {events.length > 0
                      ? events.map((event) => (
                          <em key={event.name}>
                            {event.name} · {event.time}
                          </em>
                        ))
                      : ui.toBeAnnounced}
                  </span>
                </span>
                {text.footer && <span className="invite-footer">{text.footer}</span>}
                <span className="invite-light" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <p className="flip-hint" aria-hidden="true">
        ↑ {finePointer ? ui.flipClick : ui.flipTap} · {flipped ? ui.showingDetails : ui.showingFront}
      </p>
    </section>
  );
}
