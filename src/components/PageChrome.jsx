import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ChevronsDown, Pause } from 'lucide-react';
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

/** Pixels per second for the gentle auto scroll. */
const AUTO_SCROLL_SPEED = 60;
/** Pause after the invitation opens before the page starts moving. */
const AUTO_SCROLL_DELAY = 1500;
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/**
 * Calls `onIntent` the moment the visitor tries to scroll or interact themselves
 * (wheel, touch, scroll keys, clicks — except on the auto-scroll button).
 * Returns a cleanup function.
 */
function watchUserIntent(onIntent) {
  const onPointer = (event) => {
    if (event.target instanceof Element && event.target.closest('.auto-scroll')) return;
    onIntent();
  };
  const onKey = (event) => SCROLL_KEYS.has(event.key) && onIntent();
  const opts = { passive: true, capture: true };
  window.addEventListener('wheel', onIntent, opts);
  window.addEventListener('touchstart', onPointer, opts);
  window.addEventListener('pointerdown', onPointer, opts);
  window.addEventListener('keydown', onKey, opts);
  return () => {
    window.removeEventListener('wheel', onIntent, opts);
    window.removeEventListener('touchstart', onPointer, opts);
    window.removeEventListener('pointerdown', onPointer, opts);
    window.removeEventListener('keydown', onKey, opts);
  };
}

/**
 * Slowly scrolls the page to the bottom. Starts on its own once `autoStart`
 * turns true (right after the invitation opens), stops as soon as the visitor
 * scrolls themselves, and can be toggled with the floating button.
 */
export function AutoScroll({ autoStart }) {
  const [running, setRunning] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!autoStart || reducedMotion) return undefined;
    const timer = window.setTimeout(() => setRunning(true), AUTO_SCROLL_DELAY);
    const stopWatching = watchUserIntent(() => {
      window.clearTimeout(timer);
      stopWatching();
    });
    return () => {
      window.clearTimeout(timer);
      stopWatching();
    };
  }, [autoStart, reducedMotion]);

  useEffect(() => {
    if (!running) return undefined;
    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
    // Track position as a float so slow speeds don't get lost to pixel rounding.
    let position = window.scrollY;
    let last = performance.now();
    let frame = 0;

    const step = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      position = Math.min(maxScroll(), position + AUTO_SCROLL_SPEED * dt);
      window.scrollTo({ top: position, behavior: 'instant' });
      if (position >= maxScroll() - 1) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    const stopWatching = watchUserIntent(() => setRunning(false));

    return () => {
      cancelAnimationFrame(frame);
      stopWatching();
    };
  }, [running]);

  const toggle = () => {
    if (!running) {
      const atBottom = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2;
      if (atBottom) window.scrollTo({ top: 0, behavior: 'instant' });
    }
    setRunning((value) => !value);
  };

  const label = running ? siteContent.ui.autoScrollStop : siteContent.ui.autoScrollStart;

  return (
    <button
      type="button"
      className={`auto-scroll ${running ? 'is-running' : ''}`}
      onClick={toggle}
      aria-pressed={running}
      aria-label={label}
      title={label}
    >
      {running ? <Pause size={18} aria-hidden="true" /> : <ChevronsDown size={18} aria-hidden="true" />}
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
