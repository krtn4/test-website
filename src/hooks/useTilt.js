import { useEffect } from 'react';
import { useFinePointer, useReducedMotion } from './useMediaQuery.js';

/**
 * Pointer-driven 3D tilt.
 *
 * Writes four CSS custom properties on the element, which the stylesheet
 * turns into transforms and a moving highlight:
 *   --rx / --ry  rotation in degrees
 *   --mx / --my  pointer position in % (for the light sheen)
 *
 * Updates are batched into one requestAnimationFrame per frame, and the
 * effect is skipped entirely on touch devices and for reduced motion.
 */
export function useTilt(ref, { max = 8, disabled = false } = {}) {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const active = finePointer && !reducedMotion && !disabled;

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return undefined;

    let frame = 0;
    let rect = null;

    const apply = (x, y) => {
      el.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`);
      el.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`);
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
    };

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.classList.add('is-tilting');
    };
    const onMove = (event) => {
      if (!rect) rect = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => apply(x, y));
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      rect = null;
      el.classList.remove('is-tilting');
      apply(0.5, 0.5);
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref, max, active]);
}
