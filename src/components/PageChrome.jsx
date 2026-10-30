import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import { weddingConfig } from '../data/weddingConfig.js';
import { useReducedMotion } from '../hooks/useMediaQuery.js';

/** Thin gold reading-progress line at the top of the page. */
export function ScrollProgressBar() {
  const barRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      barRef.current?.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div className="progress-bar" ref={barRef} aria-hidden="true" />;
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`to-top ${visible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
      aria-label={siteContent.ui.backToTop}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={18} />
    </button>
  );
}

/** Small-print footer. Leave weddingConfig.disclaimer empty to hide it. */
export function Disclaimer() {
  if (!weddingConfig.disclaimer) return null;
  return (
    <footer className="disclaimer">
      <p>{weddingConfig.disclaimer}</p>
    </footer>
  );
}
