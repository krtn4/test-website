import { useState } from 'react';
import { Car, Check, Copy, Hotel, Landmark, MapPin, Navigation, Phone } from 'lucide-react';
import { directionsUrl, fullAddress, hasVenueDetails, mapEmbedUrl, weddingConfig } from '../data/weddingConfig.js';
import { sectionImages } from '../data/gallery.js';
import { chapterNumber, siteContent } from '../data/siteContent.js';
import { ChapterIntro } from './ChapterLabel.jsx';

const text = siteContent.venue;
const { ui } = siteContent;
import { SmartImage } from './SmartImage.jsx';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-secure contexts.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

/** Stylised illustrated map: streets, a river and an animated route to a pulsing pin. */
function IllustratedMap() {
  return (
    <svg className="map-art" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="260" className="map-bg" />
      <path className="map-river" d="M-10 200 C 80 170, 120 230, 210 190 S 340 150, 420 175" />
      <g className="map-streets">
        <path d="M0 60 H400" />
        <path d="M0 130 C 120 120, 260 140, 400 118" />
        <path d="M60 0 V260" />
        <path d="M150 0 C 160 90, 140 170, 155 260" />
        <path d="M250 0 V260" />
        <path d="M330 0 C 320 80, 345 170, 330 260" />
        <path d="M0 20 L 180 260" className="minor" />
        <path d="M400 30 L 210 260" className="minor" />
      </g>
      <path className="map-route" pathLength="1" d="M40 235 C 70 180, 130 170, 150 130 S 230 90, 262 84" />
      <circle className="map-start" cx="40" cy="235" r="5" />
      <g className="map-pin" transform="translate(262 84)">
        <circle className="map-pulse" r="12" />
        <circle className="map-pulse map-pulse--late" r="12" />
        <path d="M0 0 C -10 -12, -14 -18, -14 -26 A 14 14 0 1 1 14 -26 C 14 -18, 10 -12, 0 0 Z" />
        <circle cy="-26" r="5" className="map-pin-dot" />
      </g>
    </svg>
  );
}

function MapPreview({ embedUrl, venueName }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded && embedUrl) {
    return (
      <div className="map-card map-card--live">
        <iframe
          title={`Map showing ${venueName}`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="map-card">
      <IllustratedMap />
      <div className="map-card-footer">
        {embedUrl ? (
          // Facade: the heavy Google Maps iframe only loads on request.
          <button type="button" className="btn btn--small" onClick={() => setLoaded(true)}>
            <MapPin size={15} aria-hidden="true" /> {text.mapButton}
          </button>
        ) : (
          <span className="map-note">{text.mapPending}</span>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, children }) {
  const empty = !children || (Array.isArray(children) && children.length === 0);
  return (
    <div className="venue-info-item">
      <dt>
        <Icon size={16} aria-hidden="true" /> {label}
      </dt>
      <dd className={empty ? 'is-empty' : ''}>{empty ? ui.toBeAnnounced : children}</dd>
    </div>
  );
}

export function VenueSection() {
  const { venue, events, dateLabel } = weddingConfig;
  const ready = hasVenueDetails(venue);
  const address = fullAddress(venue);
  const directions = directionsUrl(venue);
  const embed = mapEmbedUrl(venue);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (await copyText(address)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  const contactParts = [
    venue.contact.name,
    venue.contact.phone && (
      <a key="phone" href={`tel:${venue.contact.phone.replace(/\s+/g, '')}`}>
        {venue.contact.phone}
      </a>
    ),
    venue.contact.email && (
      <a key="email" href={`mailto:${venue.contact.email}`}>
        {venue.contact.email}
      </a>
    ),
  ].filter(Boolean);

  const cityLine = [venue.city, venue.state, venue.postalCode].filter(Boolean).join(', ');

  return (
    <section className="chapter venue" id="venue" aria-labelledby="venue-title">
      <ChapterIntro chapter={{ ...text, number: chapterNumber('venue') }} headingId="venue-title" />

      <div className="venue-grid">
        <div className="venue-visual reveal reveal--mask">
          <SmartImage photo={sectionImages.venue} sizes="(max-width: 900px) 100vw, 55vw" />
          <div className="venue-visual-shade" aria-hidden="true" />
          <div className="venue-visual-label">
            <small>{ready ? cityLine || text.labels.venue : text.labels.venue}</small>
            <span>{ready ? venue.name : ui.toBeAnnounced}</span>
          </div>
          {text.photoNote && <p className="venue-photo-note">{text.photoNote}</p>}
          <MapPreview embedUrl={embed} venueName={venue.name || text.labels.venue} />
        </div>

        <div className="venue-panel reveal" style={{ '--d': 1 }}>
          <p className={`venue-status ${ready ? 'is-ready' : ''}`}>
            <span className="status-dot" aria-hidden="true" />
            {ready ? text.statusConfirmed : text.statusPending}
          </p>

          <h3 className="venue-name">{ready ? venue.name : text.comingSoonTitle}</h3>

          <div className="venue-address">
            {ready ? (
              <address>
                {venue.addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                {cityLine && <span>{cityLine}</span>}
                {venue.country && <span>{venue.country}</span>}
              </address>
            ) : (
              <p className="is-empty">{text.comingSoonBody}</p>
            )}
          </div>

          <div className="venue-when">
            <div>
              <small>{text.labels.date}</small>
              <span>{dateLabel}</span>
            </div>
            <div>
              <small>{text.labels.timings}</small>
              {events.length > 0 ? (
                <ul>
                  {events.map((event) => (
                    <li key={event.name}>
                      <b>{event.name}</b> {event.time}
                      {event.note && <em> — {event.note}</em>}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="is-empty">{ui.toBeAnnounced}</span>
              )}
            </div>
          </div>

          <div className="venue-actions">
            {directions ? (
              <a className="btn btn--gold" href={directions} target="_blank" rel="noreferrer">
                <Navigation size={16} aria-hidden="true" /> {text.directionsLabel}
              </a>
            ) : (
              <button type="button" className="btn btn--gold" disabled>
                <Navigation size={16} aria-hidden="true" /> {text.directionsPending}
              </button>
            )}
            <button type="button" className="btn btn--line" onClick={onCopy} disabled={!ready}>
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? text.copiedLabel : text.copyLabel}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? text.copiedLabel : ''}
            </span>
          </div>

          <dl className="venue-info">
            <InfoItem icon={Landmark} label={text.labels.landmarks}>
              {venue.landmarks.length > 0 && (
                <ul>
                  {venue.landmarks.map((landmark) => (
                    <li key={landmark}>{landmark}</li>
                  ))}
                </ul>
              )}
            </InfoItem>
            <InfoItem icon={Car} label={text.labels.parking}>
              {venue.parking}
            </InfoItem>
            <InfoItem icon={Phone} label={text.labels.contact}>
              {contactParts.length > 0 && <span className="venue-contact">{contactParts}</span>}
            </InfoItem>
            <InfoItem icon={Hotel} label={text.labels.accommodation}>
              {venue.accommodation}
            </InfoItem>
          </dl>
        </div>
      </div>
    </section>
  );
}
