import { chapterNumber, fill, siteContent } from '../data/siteContent.js';
import { weddingConfig } from '../data/weddingConfig.js';
import { useCountdown } from '../hooks/useCountdown.js';
import { ChapterLabel } from './ChapterLabel.jsx';
import { Divider } from './Ornaments.jsx';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** A 0–9 strip that slides to the current digit (odometer style). */
function RollingDigit({ value }) {
  return (
    <span className="digit" aria-hidden="true">
      <span className="digit-strip" style={{ '--d': value }}>
        {DIGITS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

function CounterUnit({ value, label, minDigits = 2 }) {
  const digits = String(value).padStart(minDigits, '0').split('').map(Number);
  return (
    <div className="counter-unit">
      <strong>
        {digits.map((d, i) => (
          <RollingDigit key={digits.length - i} value={d} />
        ))}
      </strong>
      <small>{label}</small>
    </div>
  );
}

export function CountdownSection() {
  const { isValid, isPast, days, hours, minutes, seconds } = useCountdown(weddingConfig.weddingDate);
  const text = siteContent.story;
  const values = { date: weddingConfig.dateLabel };

  let status;
  let note;
  if (!isValid) {
    status = text.noDateStatus;
    note = text.noDateNote;
  } else if (isPast) {
    status = fill(text.pastStatus, values);
    note = fill(text.pastNote, values);
  } else {
    status = fill(text.upcomingStatus, values);
    note = fill(text.upcomingNote, values);
  }

  return (
    <section className="chapter story" id="story" aria-labelledby="story-title">
      <ChapterLabel number={chapterNumber('story')} title={text.chapterTitle} />
      <div className="story-grid">
        <div className="story-title reveal">
          <p className="eyebrow">{text.eyebrow}</p>
          <h2 id="story-title">
            {text.title}
            <br />
            <em>{text.accent}</em>
          </h2>
        </div>

        <div className="story-copy reveal" style={{ '--d': 1 }}>
          <p className="story-lede">{text.lede}</p>

          <p className={`counter-status ${isPast ? 'is-past' : ''}`}>
            <span className="status-dot" aria-hidden="true" />
            {status}
          </p>

          {isValid && (
            <>
              <div className="counter" role="timer" aria-label={note}>
                <CounterUnit value={days} label={text.units.days} minDigits={3} />
                <i aria-hidden="true">:</i>
                <CounterUnit value={hours} label={text.units.hours} />
                <i aria-hidden="true">:</i>
                <CounterUnit value={minutes} label={text.units.minutes} />
                <i aria-hidden="true">:</i>
                <CounterUnit value={seconds} label={text.units.seconds} />
              </div>
              <p className="sr-only">
                {days} {text.units.days}, {hours} {text.units.hours}, {minutes} {text.units.minutes} — {note}
              </p>
            </>
          )}
          <Divider className="counter-divider" />
          <small className="counter-note">{note}</small>
        </div>
      </div>
    </section>
  );
}
