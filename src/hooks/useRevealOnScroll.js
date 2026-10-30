import { useEffect } from 'react';

const THRESHOLD = 0.12;

/**
 * Adds `is-visible` to every `.reveal` element once it scrolls into view.
 * One shared IntersectionObserver for the whole page keeps this cheap.
 *
 * `.reveal--mask` elements start fully hidden by their own clip-path, and
 * browsers report their intersectionRatio as 0 until the clip opens — so
 * for those, simply entering the viewport is enough.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const masked = entry.target.classList.contains('reveal--mask');
          if (entry.isIntersecting && (masked || entry.intersectionRatio >= THRESHOLD)) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: [0, THRESHOLD], rootMargin: '0px 0px -6% 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
