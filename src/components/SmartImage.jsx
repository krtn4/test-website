import { useState } from 'react';
import { FALLBACK_IMAGE } from '../data/gallery.js';

/**
 * <img> with sensible defaults:
 * - responsive WebP versions (srcSet) so phones download small files
 * - a tiny blurred placeholder painted behind the photo while it loads
 * - intrinsic size (no layout shift), async decoding, lazy loading
 * - per-photo focal point and an ornamental fallback if the file fails
 */
export function SmartImage({ photo, eager = false, className = '', sizes = '100vw', alt, style, ...rest }) {
  const [failed, setFailed] = useState(false);
  if (!photo) return null;

  const placeholderStyle = photo.placeholder
    ? {
        backgroundImage: `url("${photo.placeholder}")`,
        backgroundSize: 'cover',
        backgroundPosition: photo.focus,
      }
    : null;

  return (
    <img
      className={className}
      src={failed ? FALLBACK_IMAGE : photo.src}
      srcSet={failed ? undefined : photo.srcSet}
      sizes={photo.srcSet ? sizes : undefined}
      alt={alt ?? photo.alt}
      width={photo.width}
      height={photo.height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      draggable="false"
      style={{ objectPosition: photo.focus, ...placeholderStyle, ...style }}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
