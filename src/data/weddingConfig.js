/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — edit everything about the event here.
 * ─────────────────────────────────────────────────────────────
 *
 * Every component reads from this file, so names, dates, venue,
 * music, RSVP and the studio call-to-action can be changed without
 * touching any component code.
 *
 * Empty strings / empty arrays are intentional: the website shows an
 * honest "coming soon" / "to be announced" state instead of fictional
 * details. Fill a field in and the matching UI appears automatically.
 */

export const weddingConfig = {
  couple: {
    partnerOne: 'Vijay',
    partnerTwo: 'Rashmika',
    partnerOneRole: 'The Groom',
    partnerTwoRole: 'The Bride',
    hashtag: '#ViRosh',
    tagline: 'Two souls, one beautiful journey.',
    description: 'A union of tradition and heart, written in gold, sealed in flowers.',
  },

  /**
   * Wedding date in ISO 8601 format, with timezone offset.
   * If this date is in the past, the countdown switches to a
   * "celebration completed" state and shows time since the date.
   */
  weddingDate: '2026-02-26T00:00:00+05:30',
  dateLabel: '26 February 2026',

  /**
   * Event timings. Leave empty until real timings are known.
   * Example entry:
   *   { name: 'Muhurtham', date: '26 February 2026', time: '7:30 AM – 9:00 AM', note: 'Main ceremony' }
   */
  events: [],

  /**
   * Venue details (the venue photograph is chosen in gallery.js → sectionImages.venue).
   * Nothing here is pre-filled because no real venue
   * information exists for this fan concept.
   *
   * mapsUrl   – a normal Google Maps share link (used for "Get Directions").
   * embedUrl  – optional: the src="" from Google Maps → Share → Embed a map.
   *             If left empty, an embed is generated from the address.
   * latitude / longitude – optional, gives the most precise directions.
   */
  venue: {
    name: '',
    addressLines: [],
    city: '',
    state: '',
    postalCode: '',
    country: '',
    mapsUrl: '',
    embedUrl: '',
    latitude: null,
    longitude: null,
    landmarks: [],
    parking: '',
    accommodation: '',
    contact: {
      name: '',
      phone: '',
      email: '',
    },
  },

  rsvp: {
    // Show / hide the RSVP chapter in siteContent.js → rsvp.enabled.
    /**
     * A form backend that accepts JSON POST requests
     * (e.g. Formspree, Getform, your own API). Leave empty to keep the
     * form in preview mode — responses are then NOT sent anywhere.
     */
    endpoint: '',
    deadline: '',
    maxGuests: 6,
  },

  music: {
    /**
     * HOW TO CHANGE THE MUSIC
     * 1. Copy a licensed audio file (MP3 recommended, M4A/OGG also work)
     *    into the  public/audio/  folder, e.g. public/audio/theme.mp3
     * 2. Set src to its path:  src: '/audio/theme.mp3'
     * 3. Optionally set the title / credit shown in the music panel.
     * Only use music you have the rights to.
     */
    src: '/audio/entrysong.mp4',
    title: 'Song title',
    credit: 'Artist / licence', 
    /**
     * Remember whether the visitor left music on, and resume it after a
     * reload. Browsers block sound until the visitor interacts with the page,
     * so it resumes immediately when allowed, otherwise on the first
     * click / tap / key press.
     */
    rememberChoice: true,
    /**
     * When no audio file is configured (or it fails to load), a soft
     * tanpura-style drone is synthesised in the browser instead.
     * Set to false to hide the music controls entirely in that case.
     */
    allowGeneratedAmbient: true,
    generatedTitle: 'Ambient tanpura',
    generatedCredit: 'Generated live in your browser',
    fallbackCredit: 'Music file unavailable — playing a generated drone',
    defaultVolume: 0.45,
  },

  /**
   * Small studio strip shown after the closing section: a one-line
   * prompt, the developer logo and the Instagram contact.
   */
  studioCta: {
    enabled: true,
    heading: 'Want a beautiful website like this?',
    contactPrefix: 'DM us on Instagram',
  },

  /**
   * Developer identity — the studio that designed and built this site.
   * The logo appears in the studio call-to-action and the closing footer;
   * Instagram is the contact channel. Set logo to '' to show the name only.
   */
  developer: {
    name: 'KRTNIX',
    tagline: 'Digital Innovation Studio',
    logo: 'brand/krtnix-logo.webp',
    instagram: 'krtnix',
    instagramUrl: 'https://www.instagram.com/krtnix/',
  },

  /** Closing-frame dedication line. Leave empty to hide it. */
  credits: {
    dedication: 'Crafted with ♥ for our Mr. & Mrs. Rowdy',
  },

  disclaimer:
    'Independent fan-made concept. This is not an official website or a real wedding announcement, and it is not affiliated with or endorsed by Vijay Deverakonda or Rashmika Mandanna. Image rights remain with their respective owners.',
};

/* ── Helpers derived from the config ─────────────────────────── */

export function hasVenueDetails(venue = weddingConfig.venue) {
  return Boolean(venue.name && venue.addressLines.length);
}

export function fullAddress(venue = weddingConfig.venue) {
  const cityLine = [venue.city, venue.state, venue.postalCode].filter(Boolean).join(', ');
  return [venue.name, ...venue.addressLines, cityLine, venue.country].filter(Boolean).join(', ');
}

/** Google Maps navigation link: coordinates > share URL > address search. */
export function directionsUrl(venue = weddingConfig.venue) {
  if (venue.latitude != null && venue.longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`;
  }
  if (venue.mapsUrl) return venue.mapsUrl;
  if (hasVenueDetails(venue)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(venue))}`;
  }
  return '';
}

/** Embeddable map URL (no API key needed for the q= form). */
export function mapEmbedUrl(venue = weddingConfig.venue) {
  if (venue.embedUrl) return venue.embedUrl;
  if (venue.latitude != null && venue.longitude != null) {
    return `https://www.google.com/maps?q=${venue.latitude},${venue.longitude}&z=15&output=embed`;
  }
  if (hasVenueDetails(venue)) {
    return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress(venue))}&z=15&output=embed`;
  }
  return '';
}
