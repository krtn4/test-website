/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — every piece of on-screen wording lives here.
 * ─────────────────────────────────────────────────────────────
 *
 * Facts (names, date, venue, RSVP, music) are in weddingConfig.js.
 * Photos and which photo appears where are in gallery.js.
 * This file holds the copywriting, so a new client's website is
 * mostly a matter of editing these three files.
 *
 * Section headings use `title` + `accent`: the accent is shown in
 * gold italics, e.g. title "The", accent "Reel." → "The Reel."
 *
 * Every chapter has `enabled`. Switch one off and it disappears from
 * the page and the menu, and the remaining chapters renumber themselves.
 */

export const siteContent = {
  /** Browser tab title and search-engine description. */
  meta: {
    title: 'ViRosh — A Cinematic Union',
    description: 'ViRosh — Vijay × Rashmika, a cinematic wedding story. An independent fan-made concept.',
  },

  /** Opening envelope shown on first load. */
  gate: {
    enabled: true,
    subtitle: 'An invitation awaits',
    enterLabel: 'Open Invitation',
    note: 'An independent fan-made concept · not an official announcement',
  },

  hero: {
    eyebrow: 'A Cinematic Union',
    ctaLabel: 'Discover their story',
    verticalNote: 'A story written in the stars',
  },

  /* ── Chapters (shown in this order) ─────────────────────── */

  story: {
    enabled: true,
    navLabel: 'Story',
    chapterTitle: 'The Beginning',
    eyebrow: 'The beginning of always',
    title: 'Forever',
    accent: 'Begins Here.',
    lede: 'Every second since that sacred moment is a frame in the most beautiful film ever made. Two stars who became one story.',
    units: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
    /** {date} is replaced with weddingConfig.dateLabel. */
    upcomingStatus: 'Counting down to {date}',
    upcomingNote: 'Until the celebration · {date}',
    pastStatus: 'The celebration took place on {date}',
    pastNote: 'Time since the celebrated date · {date}',
    noDateStatus: 'Wedding date to be announced',
    noDateNote: 'The countdown will begin once a date is set.',
  },

  reel: {
    enabled: true,
    navLabel: 'The Reel',
    chapterTitle: 'The Reel',
    eyebrow: 'A collection of moments',
    title: 'The',
    accent: 'Reel.',
    aside: 'Unspooling the most iconic frames of their most sacred day.',
  },

  /** Black-and-white quote between chapters (not numbered). */
  interlude: {
    enabled: true,
    quote: '“In every frame,',
    quoteAccent: 'a lifetime.”',
    signature: '#ViRosh · 2026',
    caption: 'Some moments cannot be captured in colour.',
  },

  couple: {
    enabled: true,
    navLabel: 'Couple',
    chapterTitle: 'The Couple',
    eyebrow: 'Two stars · one story',
    title: 'The',
    accent: 'Couple.',
    aside: 'Two stars who became one constellation.',
  },

  rituals: {
    enabled: true,
    navLabel: 'Rituals',
    chapterTitle: 'The Rituals',
    eyebrow: 'Sacred · timeless · eternal',
    title: 'The Sacred',
    accent: 'Rituals.',
    aside: 'Ancient ceremonies. Timeless gold. Laughter that echoes forever.',
    hint: 'Drag or swipe to explore',
  },

  archive: {
    enabled: true,
    navLabel: 'Archive',
    chapterTitle: 'The Archive',
    eyebrow: 'The moments we keep',
    title: 'The',
    accent: 'Archive.',
    aside: 'A few frames from a story that deserves to be endless.',
    frameLabel: 'Frame',
    buttonLabel: 'View full archive',
  },

  invitation: {
    enabled: true,
    navLabel: 'Invitation',
    chapterTitle: 'The Invitation',
    eyebrow: 'A memory, a moment, a forever',
    title: 'The',
    accent: 'Invitation.',
    cardHeading: ['A Cinematic', 'Wedding'],
    cardNumber: 'No. 001',
    verse: 'Two stars who became one constellation,',
    verseAccent: 'forever.',
    footer: 'Written in tradition · Sealed in love',
    labels: { date: 'Date', venue: 'Venue', timings: 'Timings' },
  },

  venue: {
    enabled: true,
    navLabel: 'Venue',
    chapterTitle: 'The Venue',
    eyebrow: 'Where forever begins',
    title: 'The',
    accent: 'Venue.',
    aside: 'An invitation to arrive, to witness, and to celebrate.',
    comingSoonTitle: 'Venue details coming soon',
    comingSoonBody: 'The full address, map and travel details will appear here as soon as they are confirmed.',
    statusConfirmed: 'Venue confirmed',
    statusPending: 'Awaiting confirmation',
    photoNote: 'Photograph from the celebration',
    mapPending: 'Interactive map appears once the venue is announced',
    mapButton: 'Load interactive map',
    directionsLabel: 'Get Directions',
    directionsPending: 'Directions coming soon',
    copyLabel: 'Copy address',
    copiedLabel: 'Address copied',
    labels: {
      venue: 'Venue',
      date: 'Date',
      timings: 'Timings',
      landmarks: 'Nearby landmarks',
      parking: 'Parking',
      contact: 'Contact',
      accommodation: 'Accommodation',
    },
  },

  rsvp: {
    enabled: true,
    navLabel: 'RSVP',
    chapterTitle: 'RSVP',
    eyebrow: 'Kindly reply',
    title: 'Will you',
    accent: 'join us?',
    lede: 'Your presence would make the celebration complete. Share your reply and a blessing for the couple.',
    deadlinePrefix: 'Kindly respond by',
    pastNotice: 'The celebrated date ({date}) has passed. This form is shown as a preview of the RSVP experience.',
    previewNotice: 'Preview mode: RSVP collection has not been configured yet, so replies are not sent anywhere.',
    fields: {
      name: 'Your name',
      contact: 'Phone or email',
      attending: 'Will you attend?',
      accept: 'Joyfully accepts',
      decline: 'Regretfully declines',
      guests: 'Number of guests',
      message: 'A blessing for the couple',
      optional: '(optional)',
    },
    errors: {
      name: 'Please enter your name.',
      attending: 'Please let us know if you can attend.',
      send: 'Something went wrong while sending. Please try again in a moment.',
    },
    submit: 'Send reply',
    sending: 'Sending…',
    /** {name} is replaced with the guest's first name. */
    thanks: 'Thank you, {name}.',
    sentMessage: 'Your reply has been received with gratitude.',
    previewMessage: 'This is a preview — your reply was not sent because no RSVP service is connected.',
    again: 'Send another reply',
  },

  closing: {
    lines: ['Written in tradition.', 'Sealed in love.', 'Forever.'],
    /** Index of the line shown in gold italics. */
    accentLine: 1,
    year: '2026',
    /** Small print in the bottom bar. Leave empty to hide. */
    note: 'A fan-made concept',
  },

  /** Small interface labels. */
  ui: {
    chapterWord: 'Chapter',
    numberWords: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'],
    skipLink: 'Skip to content',
    menuNote: 'A fan-made concept',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    musicOn: 'Music on',
    musicOff: 'Music off',
    musicSettings: 'Music settings',
    volume: 'Volume',
    backToTop: 'Back to top',
    autoScrollStart: 'Start auto scroll',
    autoScrollStop: 'Stop auto scroll',
    closeGallery: 'Close gallery',
    previousPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    previous: 'Previous',
    next: 'Next',
    clickHint: 'Click the card to turn it over',
    tapHint: 'Tap the card to turn it over',
    flipClick: 'Click to flip',
    flipTap: 'Tap to flip',
    showingFront: 'showing front',
    showingDetails: 'showing details',
    toBeAnnounced: 'To be announced',
  },
};

/** Chapter order on the page and in the menu. */
export const CHAPTER_ORDER = ['story', 'reel', 'couple', 'rituals', 'archive', 'invitation', 'venue', 'rsvp'];

/** Enabled chapters with their automatic numbers: [{ id, number, ...content }]. */
export const chapters = CHAPTER_ORDER.filter((id) => siteContent[id].enabled).map((id, i) => ({
  id,
  number: i + 1,
  ...siteContent[id],
}));

export const chapterNumber = (id) => chapters.find((chapter) => chapter.id === id)?.number ?? 0;

/** Replaces {placeholders} in content strings. */
export const fill = (text, values) => text.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
