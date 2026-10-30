import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { gallery } from '../data/gallery.js';
import { siteContent } from '../data/siteContent.js';

const { ui } = siteContent;
import { SmartImage } from './SmartImage.jsx';

const SWIPE_THRESHOLD = 50;
const STAGE_SIZES = '(max-width: 760px) 100vw, 60vw';

/**
 * Full-screen photo viewer.
 * Keyboard: ← / → to navigate, Esc to close, Tab stays inside.
 * Touch: horizontal swipe. Neighbouring photos are preloaded.
 */
export function Lightbox({ index, onClose, onChange }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const thumbsRef = useRef(null);
  const swipeRef = useRef(null);
  const [direction, setDirection] = useState(0);
  const count = gallery.length;
  const item = gallery[index];

  const go = (delta) => {
    setDirection(delta);
    onChange((index + delta + count) % count);
  };
  const jump = (target) => {
    setDirection(target > index ? 1 : -1);
    onChange(target);
  };

  // Focus management + scroll lock for the lifetime of the dialog.
  useEffect(() => {
    const previous = document.activeElement;
    const root = document.documentElement;
    root.classList.add('is-locked');
    closeRef.current?.focus();
    return () => {
      root.classList.remove('is-locked');
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') go(1);
      else if (event.key === 'ArrowLeft') go(-1);
      else if (event.key === 'Tab') {
        const focusable = dialogRef.current.querySelectorAll('button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Preload neighbours and keep the active thumbnail in view.
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const photo = gallery[(i + count) % count];
      const img = new Image();
      // Set sizes/srcset before src so the browser fetches the same WebP the viewer will use.
      img.sizes = STAGE_SIZES;
      if (photo.srcSet) img.srcset = photo.srcSet;
      img.src = photo.src;
    });
    thumbsRef.current?.children[index]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [index, count]);

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse') return;
    swipeRef.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="lightbox"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${count}: ${item.title}`}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="lb-top">
        <span className="lb-count">
          {String(index + 1).padStart(2, '0')} <i>/</i> {String(count).padStart(2, '0')}
        </span>
        <button ref={closeRef} type="button" className="lb-btn lb-close" onClick={onClose} aria-label={ui.closeGallery}>
          <X size={20} />
        </button>
      </div>

      <div className="lb-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <button
          type="button"
          className="lb-btn lb-arrow lb-arrow--prev"
          onClick={() => go(-1)}
          aria-label={ui.previousPhoto}
        >
          <ArrowLeft size={20} />
        </button>
        <figure key={item.id} className="lb-figure" style={{ '--dir': direction }}>
          <SmartImage photo={item} eager sizes={STAGE_SIZES} style={{ objectPosition: 'center' }} />
          <figcaption>
            <span className="lb-title">{item.title}</span>
            <span className="lb-alt">{item.alt}</span>
          </figcaption>
        </figure>
        <button
          type="button"
          className="lb-btn lb-arrow lb-arrow--next"
          onClick={() => go(1)}
          aria-label={ui.nextPhoto}
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="lb-thumbs" ref={thumbsRef}>
        {gallery.map((photo, i) => (
          <button
            type="button"
            key={photo.id}
            className={i === index ? 'is-active' : ''}
            onClick={() => jump(i)}
            aria-label={photo.title}
            aria-current={i === index}
          >
            <SmartImage photo={photo} alt="" sizes="60px" />
          </button>
        ))}
      </div>
    </div>
  );
}
