import { useId, useState } from 'react';
import { Check, Send } from 'lucide-react';
import { chapterNumber, fill, siteContent } from '../data/siteContent.js';
import { weddingConfig } from '../data/weddingConfig.js';
import { useCountdown } from '../hooks/useCountdown.js';
import { ChapterLabel, SectionHeading } from './ChapterLabel.jsx';

const text = siteContent.rsvp;
import { CornerFlourish } from './Ornaments.jsx';

const EMPTY = { name: '', contact: '', attending: '', guests: '1', message: '' };

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = text.errors.name;
  if (!values.attending) errors.attending = text.errors.attending;
  return errors;
}

export function RsvpSection() {
  const { rsvp, dateLabel } = weddingConfig;
  const { isPast } = useCountdown(weddingConfig.weddingDate);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | preview | error
  const uid = useId();
  const field = (name) => `${uid}-${name}`;
  const previewMode = !rsvp.endpoint;

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(field(Object.keys(found)[0]))?.focus();
      return;
    }
    if (previewMode) {
      setStatus('preview');
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch(rsvp.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, guests: Number(values.guests) }),
      });
      if (!response.ok) throw new Error(`RSVP failed: ${response.status}`);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const done = status === 'sent' || status === 'preview';

  return (
    <section className="chapter rsvp" id="rsvp" aria-labelledby="rsvp-title">
      <ChapterLabel number={chapterNumber('rsvp')} title={text.chapterTitle} />
      <div className="rsvp-grid">
        <div className="rsvp-intro">
          <SectionHeading id="rsvp-title" eyebrow={text.eyebrow} title={text.title} accent={text.accent} />
          <p className="rsvp-lede reveal">{text.lede}</p>
          {rsvp.deadline && (
            <p className="rsvp-deadline reveal">
              {text.deadlinePrefix} {rsvp.deadline}
            </p>
          )}
          {(previewMode || isPast) && (
            <p className="rsvp-notice reveal">
              {isPast ? fill(text.pastNotice, { date: dateLabel }) : text.previewNotice}
            </p>
          )}
        </div>

        <div className="rsvp-card reveal" style={{ '--d': 1 }}>
          <CornerFlourish className="rsvp-corner tl" />
          <CornerFlourish className="rsvp-corner br" />

          {done ? (
            <div className="rsvp-done" role="status">
              <span className="rsvp-done-icon" aria-hidden="true">
                <Check size={28} />
              </span>
              <h3>{fill(text.thanks, { name: values.name.trim().split(' ')[0] })}</h3>
              <p>{status === 'sent' ? text.sentMessage : text.previewMessage}</p>
              <button
                type="button"
                className="btn btn--line"
                onClick={() => {
                  setValues(EMPTY);
                  setStatus('idle');
                }}
              >
                {text.again}
              </button>
            </div>
          ) : (
            <form className="rsvp-form" onSubmit={onSubmit} noValidate>
              <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor={field('name')}>{text.fields.name}</label>
                <input
                  id={field('name')}
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={update}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${field('name')}-error` : undefined}
                />
                {errors.name && (
                  <span className="form-error" id={`${field('name')}-error`}>
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor={field('contact')}>
                  {text.fields.contact} <span className="optional">{text.fields.optional}</span>
                </label>
                <input id={field('contact')} name="contact" value={values.contact} onChange={update} />
              </div>

              <fieldset className={`form-field form-choice ${errors.attending ? 'has-error' : ''}`}>
                <legend id={field('attending')} tabIndex={-1}>
                  {text.fields.attending}
                </legend>
                <div className="choice-row">
                  {[
                    ['yes', text.fields.accept],
                    ['no', text.fields.decline],
                  ].map(([value, label]) => (
                    <label key={value} className={`choice ${values.attending === value ? 'is-checked' : ''}`}>
                      <input
                        type="radio"
                        name="attending"
                        value={value}
                        checked={values.attending === value}
                        onChange={update}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {errors.attending && <span className="form-error">{errors.attending}</span>}
              </fieldset>

              {values.attending !== 'no' && (
                <div className="form-field form-field--short">
                  <label htmlFor={field('guests')}>{text.fields.guests}</label>
                  <select id={field('guests')} name="guests" value={values.guests} onChange={update}>
                    {Array.from({ length: rsvp.maxGuests }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-field">
                <label htmlFor={field('message')}>
                  {text.fields.message} <span className="optional">{text.fields.optional}</span>
                </label>
                <textarea id={field('message')} name="message" rows="3" value={values.message} onChange={update} />
              </div>

              {status === 'error' && (
                <p className="form-error form-error--banner" role="alert">
                  {text.errors.send}
                </p>
              )}

              <button type="submit" className="btn btn--gold rsvp-submit" disabled={status === 'sending'}>
                <Send size={16} aria-hidden="true" />
                {status === 'sending' ? text.sending : text.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
