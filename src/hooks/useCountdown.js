import { useEffect, useState } from 'react';

const split = (ms) => {
  const total = Math.floor(Math.abs(ms) / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

/**
 * Live countdown to `targetIso`.
 * Once the date has passed, `isPast` is true and the parts describe the
 * time elapsed since the date — never a negative countdown.
 */
export function useCountdown(targetIso) {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let timeoutId;
    // Align ticks to the start of each second so digits change in sync with the clock.
    const tick = () => {
      setNow(Date.now());
      timeoutId = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, []);

  if (Number.isNaN(target)) {
    return { isValid: false, isPast: false, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const diff = target - now;
  return { isValid: true, isPast: diff <= 0, ...split(diff) };
}
