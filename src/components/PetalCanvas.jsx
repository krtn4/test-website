import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useMediaQuery.js';

/** Rose, marigold and jasmine tones. */
const PETAL_COLORS = [
  ['#c2392f', '#7d1820'],
  ['#de5d2a', '#9b3016'],
  ['#eba63e', '#b86f18'],
  ['#f4ead9', '#cdbb9c'],
  ['#9c2433', '#5a0f1a'],
];

/** Pre-render one petal per colour so each frame is just drawImage calls. */
function makePetalSprite([light, dark]) {
  const size = 48;
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 4, 0, size - 4);
  gradient.addColorStop(0, light);
  gradient.addColorStop(1, dark);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(size / 2, 3);
  ctx.bezierCurveTo(size * 0.95, size * 0.2, size * 0.86, size * 0.8, size / 2, size - 3);
  ctx.bezierCurveTo(size * 0.14, size * 0.8, size * 0.05, size * 0.2, size / 2, 3);
  ctx.fill();
  // Central vein for a touch of realism.
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(size / 2, 8);
  ctx.quadraticCurveTo(size * 0.54, size / 2, size / 2, size - 8);
  ctx.stroke();
  return sprite;
}

function makeSparkSprite() {
  const size = 32;
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,236,190,1)');
  gradient.addColorStop(0.25, 'rgba(231,190,110,0.55)');
  gradient.addColorStop(1, 'rgba(199,166,107,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

const rand = (min, max) => min + Math.random() * (max - min);

/**
 * Falling petals + rising gold dust on a single 2D canvas.
 *
 * Performance notes:
 * - Sprites are rendered once; each frame only transforms + draws them.
 * - Device pixel ratio is capped at 1.5 and counts drop ~55% on phones.
 * - The loop stops when the canvas is off-screen or the tab is hidden.
 * - Nothing renders at all for prefers-reduced-motion.
 */
export function PetalCanvas({ petals = 30, sparks = 44, className = '' }) {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return undefined;
    const ctx = canvas.getContext('2d');

    const isSmall = window.innerWidth < 760;
    const petalCount = Math.round(petals * (isSmall ? 0.45 : 1));
    const sparkCount = Math.round(sparks * (isSmall ? 0.45 : 1));
    const petalSprites = PETAL_COLORS.map(makePetalSprite);
    const sparkSprite = makeSparkSprite();

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let last = 0;
    let inView = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();

    // Depth `z` drives size, speed and opacity so near petals feel closer.
    const spawnPetal = (anywhere) => {
      const z = rand(0.35, 1);
      return {
        x: rand(-0.05, 1.05) * width,
        y: anywhere ? rand(-0.1, 1) * height : rand(-0.25, -0.05) * height,
        z,
        size: rand(12, 24) * z,
        vy: rand(22, 46) * z,
        vx: rand(-8, 14) * z,
        sway: rand(12, 34),
        swayFreq: rand(0.4, 1.1),
        phase: rand(0, Math.PI * 2),
        rot: rand(0, Math.PI * 2),
        vr: rand(-1.2, 1.2),
        flip: rand(0, Math.PI * 2),
        vf: rand(1.2, 2.8),
        sprite: petalSprites[Math.floor(Math.random() * petalSprites.length)],
      };
    };
    const spawnSpark = (anywhere) => ({
      x: rand(0, 1) * width,
      y: anywhere ? rand(0, 1) * height : height + 10,
      size: rand(4, 13),
      vy: rand(6, 20),
      drift: rand(-6, 6),
      phase: rand(0, Math.PI * 2),
      twinkle: rand(0.8, 2.2),
      alpha: rand(0.25, 0.75),
    });

    const petalList = Array.from({ length: petalCount }, () => spawnPetal(true));
    const sparkList = Array.from({ length: sparkCount }, () => spawnSpark(true));

    const render = (time) => {
      const t = time / 1000;
      const dt = Math.min(0.05, last ? t - last : 0.016);
      last = t;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Gold dust: additive blending for a soft glow.
      ctx.globalCompositeOperation = 'lighter';
      for (const s of sparkList) {
        s.y -= s.vy * dt;
        s.x += Math.sin(t * 0.6 + s.phase) * s.drift * dt;
        if (s.y < -20) Object.assign(s, spawnSpark(false));
        ctx.globalAlpha = s.alpha * (0.45 + 0.55 * Math.sin(t * s.twinkle + s.phase) ** 2);
        ctx.drawImage(sparkSprite, s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
      }

      ctx.globalCompositeOperation = 'source-over';
      for (const p of petalList) {
        p.y += p.vy * dt;
        p.x += (p.vx + Math.sin(t * p.swayFreq + p.phase) * p.sway) * dt;
        p.rot += p.vr * dt;
        p.flip += p.vf * dt;
        if (p.y > height + 30) Object.assign(p, spawnPetal(false));

        // Scaling X by cos(flip) fakes a petal tumbling in 3D.
        const flipScale = Math.cos(p.flip);
        ctx.globalAlpha = 0.5 + p.z * 0.45;
        ctx.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr);
        ctx.rotate(p.rot);
        ctx.scale(Math.abs(flipScale) < 0.12 ? 0.12 : flipScale, 1);
        ctx.drawImage(p.sprite, -p.size / 2, -p.size * 0.6, p.size, p.size * 1.2);
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (!frame && inView && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(render);
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [petals, sparks, reducedMotion]);

  if (reducedMotion) return null;
  return <canvas ref={canvasRef} className={`petal-canvas ${className}`} aria-hidden="true" />;
}
