import { useSyncExternalStore } from 'react';

/** Subscribes to a CSS media query and re-renders when it changes. */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** True for mouse / trackpad users — pointer effects are skipped on touch. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
