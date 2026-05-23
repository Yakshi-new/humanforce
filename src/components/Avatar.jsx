import { useState } from 'react'
import './Avatar.css'

/**
 * Universal Avatar component.
 *
 * Props:
 *  src    – image URL (from user.avatar)
 *  name   – full name or firstName, used to derive initials on fallback
 *  role   – 'customer' | 'provider' | 'admin'  (drives fallback color)
 *  size   – number (px) or CSS string. Default: 40
 *  className – extra CSS class
 *  style  – extra inline styles
 */
export default function Avatar({ src, name = '', role = 'customer', size = 40, className = '', style = {} }) {
  const [imgError, setImgError] = useState(false)

  // Derive initials from name
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
    || '?'

  const sizeStyle = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    fontSize: typeof size === 'number' ? `${Math.round(size * 0.36)}px` : '1rem',
    ...style,
  }

  const showImage = src && !imgError

  return (
    <div
      className={`hf-avatar hf-avatar--${role} ${className}`}
      style={sizeStyle}
      aria-label={name || role}
    >
      {showImage ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="hf-avatar__img"
          onError={() => setImgError(true)}
          draggable={false}
        />
      ) : (
        <span className="hf-avatar__initials">{initials}</span>
      )}

      {/* Role badge dot */}
      <span className={`hf-avatar__dot hf-avatar__dot--${role}`} aria-hidden="true" />
    </div>
  )
}
