import { reel } from '../data/gallery.js';
import { chapterNumber, siteContent } from '../data/siteContent.js';
import { ChapterIntro } from './ChapterLabel.jsx';
import { SmartImage } from './SmartImage.jsx';
import { TiltCard } from './TiltCard.jsx';

export function ReelSection({ onOpen }) {
  const chapter = { ...siteContent.reel, number: chapterNumber('reel') };

  return (
    <section className="chapter reel-section" id="reel" aria-labelledby="reel-title">
      <ChapterIntro chapter={chapter} headingId="reel-title" />

      <div className="reel-grid">
        {reel.map((frame, i) => (
          <TiltCard
            key={frame.id}
            className={`reel-card reveal reveal--mask r${i}`}
            style={{ '--d': i % 3 }}
            onClick={() => onOpen(frame.id)}
            aria-label={`${frame.frame}: ${frame.title}`}
          >
            <SmartImage photo={frame} sizes="(max-width: 760px) 50vw, 30vw" />
            <span className="film-perf" aria-hidden="true" />
            <span className="frame-no">{frame.frame}</span>
            <span className="frame-name">
              {frame.title} <b aria-hidden="true">↗</b>
            </span>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
