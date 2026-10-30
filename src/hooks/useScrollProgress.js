import { useEffect } from 'react';

/**
 * Writes `--progress` (0 → 1) on an element while it travels through the
 * viewport: 0 when its top meets the bottom of the screen, 1 when its
 * bottom leaves the top. CSS uses it for scroll-linked parallax.
 * The listener only runs work while the element is near the viewport.
 */
export function useScrollProgress(ref, { disabled = false } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return undefined;

    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      el.style.setProperty('--progress', Math.min(1, Math.max(0, progress)).toFixed(4));
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: '120px 0px' },
    );
    observer.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, disabled]);
}
