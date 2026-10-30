import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { galleryIndex } from './data/gallery.js';
import { chapters, siteContent } from './data/siteContent.js';
import { audioEngine } from './lib/audioEngine.js';
import { useRevealOnScroll } from './hooks/useRevealOnScroll.js';
import { ArchiveSection } from './components/ArchiveSection.jsx';
import { CinemaInterlude } from './components/CinemaInterlude.jsx';
import { ClosingSection } from './components/ClosingSection.jsx';
import { CountdownSection } from './components/CountdownSection.jsx';
import { CoupleSection } from './components/CoupleSection.jsx';
import { Hero } from './components/Hero.jsx';
import { InvitationSection } from './components/InvitationSection.jsx';
import { OpeningGate } from './components/OpeningGate.jsx';
import { BackToTop, Disclaimer, ScrollProgressBar } from './components/PageChrome.jsx';
import { ReelSection } from './components/ReelSection.jsx';
import { RitualsSection } from './components/RitualsSection.jsx';
import { RsvpSection } from './components/RsvpSection.jsx';
import { SiteHeader } from './components/SiteHeader.jsx';
import { StudioCta } from './components/StudioCta.jsx';
import { VenueSection } from './components/VenueSection.jsx';

// The lightbox is only needed after a photo is clicked, so it loads on demand.
const Lightbox = lazy(() => import('./components/Lightbox.jsx').then((m) => ({ default: m.Lightbox })));

/** Chapter id → component. Order and on/off switches live in siteContent.js. */
const CHAPTER_COMPONENTS = {
  story: CountdownSection,
  reel: ReelSection,
  couple: CoupleSection,
  rituals: RitualsSection,
  archive: ArchiveSection,
  invitation: InvitationSection,
  venue: VenueSection,
  rsvp: RsvpSection,
};

/** The black-and-white interlude sits right after this chapter. */
const INTERLUDE_AFTER = 'reel';

export default function App() {
  // Deep links (e.g. /#venue) skip the opening gate and land directly on the section.
  const showGate = siteContent.gate.enabled && !window.location.hash;
  const [gateVisible, setGateVisible] = useState(showGate);
  const [live, setLive] = useState(!showGate);
  const [photoIndex, setPhotoIndex] = useState(null);

  useRevealOnScroll();

  // Bring background music back if the visitor had it on before reloading.
  useEffect(() => audioEngine.resumeIfRemembered(), []);

  const openPhoto = useCallback((id) => setPhotoIndex(Math.max(0, galleryIndex(id))), []);
  const closePhoto = useCallback(() => setPhotoIndex(null), []);

  return (
    <>
      <a className="skip-link" href={chapters[0] ? `#${chapters[0].id}` : '#top'}>
        {siteContent.ui.skipLink}
      </a>
      <div className="grain" aria-hidden="true" />
      <ScrollProgressBar />

      <div className="page" inert={gateVisible || photoIndex !== null}>
        <SiteHeader visible={live} />
        <main>
          <Hero live={live} />
          {chapters.map(({ id }) => {
            const Section = CHAPTER_COMPONENTS[id];
            return (
              <div key={id} style={{ display: 'contents' }}>
                <Section onOpen={openPhoto} />
                {id === INTERLUDE_AFTER && siteContent.interlude.enabled && <CinemaInterlude />}
              </div>
            );
          })}
          <ClosingSection />
        </main>
        <StudioCta />
        <Disclaimer />
        <BackToTop />
      </div>

      {photoIndex !== null && (
        <Suspense fallback={null}>
          <Lightbox index={photoIndex} onChange={setPhotoIndex} onClose={closePhoto} />
        </Suspense>
      )}

      {gateVisible && <OpeningGate onEnter={() => setLive(true)} onDone={() => setGateVisible(false)} />}
    </>
  );
}
