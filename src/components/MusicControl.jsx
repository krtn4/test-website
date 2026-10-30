import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Music2, Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import { audioEngine } from '../lib/audioEngine.js';

const { ui } = siteContent;

const BAR_COUNT = 5;

/** Five gold bars driven by the live analyser; idle bars rest low. */
function Visualizer({ playing }) {
  const barsRef = useRef([]);

  useEffect(() => {
    if (!playing) {
      barsRef.current.forEach((bar) => bar && (bar.style.transform = 'scaleY(0.18)'));
      return undefined;
    }
    const data = new Uint8Array(32);
    let frame = 0;
    const draw = () => {
      if (audioEngine.readFrequencies(data)) {
        barsRef.current.forEach((bar, i) => {
          // Sample low–mid bins where the drone / music energy lives.
          const value = data[2 + i * 3] / 255;
          if (bar) bar.style.transform = `scaleY(${Math.max(0.15, value).toFixed(3)})`;
        });
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  return (
    <span className="visualizer" aria-hidden="true">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <i key={i} ref={(el) => (barsRef.current[i] = el)} />
      ))}
    </span>
  );
}

export function MusicControl() {
  const state = useSyncExternalStore(audioEngine.subscribe, audioEngine.getState);
  const [panelOpen, setPanelOpen] = useState(false);
  const wrapRef = useRef(null);
  const playing = state.status === 'playing';

  useEffect(() => {
    if (!panelOpen) return undefined;
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setPanelOpen(false);
    };
    const onKey = (event) => event.key === 'Escape' && setPanelOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [panelOpen]);

  if (state.status === 'unavailable') return null;

  const VolumeIcon = state.volume === 0 ? VolumeX : state.volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="music" ref={wrapRef}>
      <button
        type="button"
        className={`music-toggle ${playing ? 'is-playing' : ''}`}
        onClick={() => audioEngine.toggle()}
        aria-pressed={playing}
        aria-label={playing ? ui.musicOn : ui.musicOff}
      >
        {playing ? <Visualizer playing /> : <Music2 size={16} className="music-icon" aria-hidden="true" />}
        <span className="music-label">{playing ? ui.musicOn : ui.musicOff}</span>
      </button>
      <button
        type="button"
        className="music-more"
        onClick={() => setPanelOpen((open) => !open)}
        aria-expanded={panelOpen}
        aria-controls="music-panel"
        aria-label={ui.musicSettings}
      >
        <VolumeIcon size={16} aria-hidden="true" />
      </button>

      {panelOpen && (
        <div className="music-panel" id="music-panel">
          <p className="music-title">{state.title}</p>
          {state.credit && <p className="music-credit">{state.credit}</p>}
          <div className="music-row">
            <button
              type="button"
              className="music-play"
              onClick={() => audioEngine.toggle()}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <label className="music-volume">
              <span className="sr-only">{ui.volume}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.volume}
                onChange={(event) => audioEngine.setVolume(parseFloat(event.target.value))}
                style={{ '--fill': `${state.volume * 100}%` }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
