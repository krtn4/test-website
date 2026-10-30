import { useRef } from 'react';
import { useTilt } from '../hooks/useTilt.js';

/**
 * Wrapper that tilts its content in 3D toward the pointer and moves a
 * soft light sheen across it. Renders a <button> when given onClick.
 */
export function TiltCard({ as, className = '', max = 7, children, style, ...rest }) {
  const ref = useRef(null);
  useTilt(ref, { max });
  const Tag = as ?? (rest.onClick ? 'button' : 'div');

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      style={style}
      {...(Tag === 'button' ? { type: 'button' } : {})}
      {...rest}
    >
      <span className="tilt-inner">
        {children}
        <span className="tilt-sheen" aria-hidden="true" />
      </span>
    </Tag>
  );
}
