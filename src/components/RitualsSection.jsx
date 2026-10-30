import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { rituals } from '../data/gallery.js';
import { chapterNumber, siteContent } from '../data/siteContent.js';
import { useReducedMotion } from '../hooks/useMediaQuery.js';
import { ChapterIntro } from './ChapterLabel.jsx';

const { ui } = siteContent;
import { SmartImage } from './SmartImage.jsx';

/**
 * Horizontal ritual rail with a "coverflow" depth effect.
 *
 * On scroll, each card's distance from the rail centre is written to
 * --offset (signed) and --dist (absolute); CSS turns these into a gentle
 * rotateY + scale so cards appear to curve around the viewer.
 * Mouse users can drag the rail; touch users get native swipe + snap.
 */
export function RitualsSection({ onOpen }) {
  const chapter = { ...siteContent.rituals, number: chapterNumber('rituals') };
  const railRef = useRef(null);
  const dragRef = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });
  const [edges, setEdges] = useState({ start: true, end: false });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const railRect = rail.getBoundingClientRect();
      const centre = railRect.left + railRect.width / 2;
      if (!reducedMotion) {
        for (const card of rail.children) {
          const rect = card.getBoundingClientRect();
          const offset = Math.max(-1.5, Math.min(1.5, (rect.left + rect.width / 2 - centre) / railRect.width));
          card.style.setProperty('--offset', offset.toFixed(3));
          card.style.setProperty('--dist', Math.abs(offset).toFixed(3));
        }
      }
      const start = rail.scrollLeft < 8;
      const end = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
      // Only re-render when an edge state actually flips.
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    rail.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reducedMotion]);

  const step = (direction) => {
    const rail = railRef.current;
    const card = rail?.firstElementChild;
    if (!card) return;
    rail.scrollBy({ left: direction * (card.offsetWidth + 20), behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  /* Mouse drag-to-scroll. Touch & pen use native scrolling instead. */
  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragRef.current = { active: true, moved: false, startX: event.clientX, startScroll: railRef.current.scrollLeft };
  };
  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 6) {
      drag.moved = true;
      railRef.current.classList.add('is-dragging');
      railRef.current.setPointerCapture(event.pointerId);
    }
    if (drag.moved) railRef.current.scrollLeft = drag.startScroll - dx;
  };
  const endDrag = () => {
    dragRef.current.active = false;
    railRef.current?.classList.remove('is-dragging');
  };
  // Swallow the click that follows a drag so it doesn't open the lightbox.
  const onClickCapture = (event) => {
    if (dragRef.current.moved) {
      event.stopPropagation();
      event.preventDefault();
      dragRef.current.moved = false;
    }
  };

  return (
    <section className="chapter rituals" id="rituals" aria-labelledby="rituals-title">
      <ChapterIntro chapter={chapter} headingId="rituals-title" />

      <div
        className="ritual-rail"
        ref={railRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {rituals.map((item, i) => (
          <button
            type="button"
            className="ritual-card"
            key={item.id}
            onClick={() => onOpen(item.id)}
            aria-label={item.title}
          >
            <span className="ritual-card-inner">
              <SmartImage photo={item} sizes="(max-width: 760px) 78vw, 32vw" />
              <span className="ritual-caption">
                <small>{String(i + 1).padStart(2, '0')}</small> {item.title}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="rail-controls">
        <button type="button" onClick={() => step(-1)} disabled={edges.start} aria-label={ui.previous}>
          <ArrowLeft size={18} />
        </button>
        <span className="rail-hint" aria-hidden="true">
          {chapter.hint}
        </span>
        <button type="button" onClick={() => step(1)} disabled={edges.end} aria-label={ui.next}>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
