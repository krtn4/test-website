import { weddingConfig } from '../data/weddingConfig.js';

/**
 * Background audio engine (singleton).
 *
 * - Plays the licensed file from weddingConfig.music.src when present.
 * - Otherwise (or if the file fails to load) synthesises a gentle
 *   tanpura-style drone with the Web Audio API, so nothing copyrighted
 *   is ever bundled.
 * - Never starts by itself on a first visit: play() must come from a click/tap.
 * - Remembers whether the visitor left music on. After a reload it resumes
 *   immediately if the browser allows sound, otherwise on the visitor's
 *   first click, tap or key press (browsers block sound before that).
 * - Exposes an AnalyserNode for the visualiser and a tiny subscribe()
 *   API for React's useSyncExternalStore.
 */

const VOLUME_KEY = 'virosh:volume';
const MUSIC_ON_KEY = 'virosh:music-on';
const GESTURE_EVENTS = ['pointerdown', 'keydown', 'touchend'];

const storage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode) — the choice just won't persist */
    }
  },
};
const FADE_IN = 1.4;
const FADE_OUT = 0.6;

const readStoredVolume = () => {
  const stored = parseFloat(storage.get(VOLUME_KEY));
  return Number.isFinite(stored) ? Math.min(1, Math.max(0, stored)) : null;
};

class AudioEngine {
  constructor(config) {
    this.config = config;
    this.listeners = new Set();
    this.ctx = null;
    this.master = null;
    this.analyser = null;
    this.element = null;
    this.droneTimer = 0;
    this.nextNoteTime = 0;
    this.noteIndex = 0;
    this.stopTimer = 0;

    const useFile = Boolean(config.src);
    const available = useFile || config.allowGeneratedAmbient;
    this.state = {
      status: available ? 'idle' : 'unavailable', // idle | playing | paused | unavailable
      source: useFile ? 'file' : available ? 'generated' : null,
      volume: config.defaultVolume ?? 0.45,
      title: useFile ? config.title || 'Background music' : config.generatedTitle,
      credit: useFile ? config.credit : config.generatedCredit,
    };
  }

  /* ── store API ───────────────────────────────────────────── */

  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = () => this.state;

  setState(patch) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  /* ── setup ───────────────────────────────────────────────── */

  ensureContext() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.82;
    this.master.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    const stored = readStoredVolume();
    if (stored != null) this.setState({ volume: stored });

    if (this.state.source === 'file') this.setupFile();
    else this.setupDrone();
  }

  setupFile() {
    const audio = new Audio();
    audio.src = this.config.src;
    audio.loop = true;
    audio.preload = 'auto';
    audio.addEventListener('error', () => this.handleFileError(), { once: true });
    this.element = audio;
    this.ctx.createMediaElementSource(audio).connect(this.master);
  }

  handleFileError() {
    if (this.config.allowGeneratedAmbient) {
      const wasPlaying = this.state.status === 'playing';
      this.setState({
        source: 'generated',
        title: this.config.generatedTitle,
        credit: this.config.fallbackCredit,
      });
      this.setupDrone();
      if (wasPlaying) this.startDrone();
    } else {
      this.setState({ status: 'unavailable', source: null });
    }
  }

  /** Soft reverb built from decaying noise; gives the drone a temple-hall space. */
  setupDrone() {
    if (this.droneBus) return;
    const ctx = this.ctx;
    const seconds = 3.2;
    const impulse = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2.6;
      }
    }
    const reverb = ctx.createConvolver();
    reverb.buffer = impulse;
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    this.droneBus = ctx.createGain();
    this.droneBus.gain.value = 0.9;
    this.droneBus.connect(this.master);
    this.droneBus.connect(reverb);
    reverb.connect(wet);
    wet.connect(this.master);
  }

  /** One tanpura "pluck": a filtered sawtooth with a slow exponential decay. */
  pluck(frequency, time) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = frequency;
    osc.detune.value = (Math.random() - 0.5) * 6;
    sub.type = 'sine';
    sub.frequency.value = frequency;

    filter.type = 'lowpass';
    filter.Q.value = 2.2;
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.exponentialRampToValueAtTime(520, time + 3.5);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.085, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 5);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(this.droneBus);
    osc.start(time);
    sub.start(time);
    osc.stop(time + 5.1);
    sub.stop(time + 5.1);
  }

  startDrone() {
    // Classic tanpura cycle: Pa – Sa' – Sa' – Sa (low), tonic on D.
    const sa = 146.83;
    const pattern = [sa * 0.75, sa, sa, sa * 0.5];
    const step = 0.95;
    this.nextNoteTime = Math.max(this.nextNoteTime, this.ctx.currentTime + 0.05);
    clearInterval(this.droneTimer);
    // Lookahead scheduler: queue notes slightly ahead of time for sample-accurate timing.
    this.droneTimer = setInterval(() => {
      while (this.nextNoteTime < this.ctx.currentTime + 0.6) {
        this.pluck(pattern[this.noteIndex % pattern.length], this.nextNoteTime);
        this.nextNoteTime += this.noteIndex % pattern.length === pattern.length - 1 ? step * 1.6 : step;
        this.noteIndex += 1;
      }
    }, 200);
  }

  stopDrone() {
    clearInterval(this.droneTimer);
    this.droneTimer = 0;
  }

  /* ── transport ───────────────────────────────────────────── */

  /**
   * Called once on page load. If the visitor had music on last time,
   * start again now when the browser permits it, or on their first gesture.
   * Returns a cleanup function that removes any pending gesture listeners.
   */
  resumeIfRemembered() {
    const noop = () => {};
    if (!this.config.rememberChoice || storage.get(MUSIC_ON_KEY) !== 'true') return noop;
    if (this.state.status === 'unavailable' || this.state.status === 'playing') return noop;

    // Some browsers (e.g. after earlier interaction with the site) allow sound right away.
    if (navigator.userActivation?.hasBeenActive) {
      this.play();
      return noop;
    }

    const onGesture = (event) => {
      removeListeners();
      // A tap on the music button itself is handled by that button, so don't double-toggle.
      if (event.target instanceof Element && event.target.closest('.music')) return;
      this.play();
    };
    const removeListeners = () => GESTURE_EVENTS.forEach((type) => window.removeEventListener(type, onGesture, true));
    GESTURE_EVENTS.forEach((type) => window.addEventListener(type, onGesture, true));
    return removeListeners;
  }

  /** Starts playback; overlapping calls (e.g. a gesture listener and a button) share one start. */
  play() {
    if (!this.starting) this.starting = this.start().finally(() => (this.starting = null));
    return this.starting;
  }

  async start() {
    if (this.state.status === 'unavailable' || this.state.status === 'playing') return;
    this.ensureContext();
    storage.set(MUSIC_ON_KEY, 'true');
    clearTimeout(this.stopTimer);
    if (this.ctx.state !== 'running') {
      // If the browser is blocking sound (no user gesture yet), resume() never
      // settles — give up after a moment so the next click can try again.
      await Promise.race([this.ctx.resume(), new Promise((resolve) => setTimeout(resolve, 800))]);
      if (this.ctx.state !== 'running') return;
    }

    if (this.state.source === 'file' && this.element) {
      try {
        await this.element.play();
      } catch {
        this.handleFileError();
        if (this.state.source !== 'generated') return;
      }
    }
    if (this.state.source === 'generated') this.startDrone();

    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(this.state.volume, now + FADE_IN);
    this.setState({ status: 'playing' });
  }

  pause() {
    if (!this.ctx || this.state.status !== 'playing') return;
    storage.set(MUSIC_ON_KEY, 'false');
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + FADE_OUT);
    this.setState({ status: 'paused' });
    this.stopTimer = setTimeout(
      () => {
        this.stopDrone();
        this.element?.pause();
      },
      FADE_OUT * 1000 + 50,
    );
  }

  toggle() {
    if (this.state.status === 'playing') this.pause();
    else this.play();
  }

  setVolume(volume) {
    const value = Math.min(1, Math.max(0, volume));
    this.setState({ volume: value });
    storage.set(VOLUME_KEY, String(value));
    if (this.ctx && this.state.status === 'playing') {
      this.master.gain.setTargetAtTime(value, this.ctx.currentTime, 0.08);
    }
  }

  /** Fills `array` with frequency data (0–255); returns false when silent. */
  readFrequencies(array) {
    if (!this.analyser || this.state.status !== 'playing') return false;
    this.analyser.getByteFrequencyData(array);
    return true;
  }
}

export const audioEngine = new AudioEngine(weddingConfig.music);
