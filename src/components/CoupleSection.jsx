import { sectionImages } from '../data/gallery.js';
import { chapterNumber, siteContent } from '../data/siteContent.js';
import { weddingConfig } from '../data/weddingConfig.js';
import { ChapterIntro } from './ChapterLabel.jsx';
import { CornerFlourish } from './Ornaments.jsx';
import { SmartImage } from './SmartImage.jsx';
import { TiltCard } from './TiltCard.jsx';

function Portrait({ photo, role, name, side, onOpen }) {
  return (
    <TiltCard
      className={`portrait portrait--${side} reveal reveal--mask`}
      style={{ '--d': side === 'left' ? 0 : 1 }}
      max={5}
      onClick={onOpen}
      aria-label={`${role}: ${name} — view photograph`}
    >
      <SmartImage photo={photo} sizes="(max-width: 760px) 50vw, 38vw" />
      <CornerFlourish className="portrait-corner portrait-corner--tl" />
      <CornerFlourish className="portrait-corner portrait-corner--br" />
      <span className="portrait-caption">
        <small>{role}</small>
        <span className="portrait-name">{name}</span>
      </span>
    </TiltCard>
  );
}

export function CoupleSection({ onOpen }) {
  const { couple } = weddingConfig;
  const chapter = { ...siteContent.couple, number: chapterNumber('couple') };
  return (
    <section className="chapter couple" id="couple" aria-labelledby="couple-title">
      <ChapterIntro chapter={chapter} headingId="couple-title" />
      <div className="couple-row">
        <Portrait
          photo={sectionImages.groom}
          role={couple.partnerOneRole}
          name={couple.partnerOne}
          side="left"
          onOpen={() => onOpen(sectionImages.groom.id)}
        />
        <div className="couple-seal reveal" aria-hidden="true">
          <span>&amp;</span>
        </div>
        <Portrait
          photo={sectionImages.bride}
          role={couple.partnerTwoRole}
          name={couple.partnerTwo}
          side="right"
          onOpen={() => onOpen(sectionImages.bride.id)}
        />
      </div>
    </section>
  );
}
