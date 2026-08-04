import { useState } from 'react'
import './ImagePanel.css'

/**
 * Framed image with a caption bar. `transparent` puts a checkerboard behind
 * the image so a transparent PNG actually reads as transparent.
 * Children render on top — that's where the Loader overlay goes.
 */
export default function ImagePanel({
  src,
  alt,
  label,
  meta,
  transparent = false,
  children,
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure className="image-panel">
      <div
        className={`image-panel__frame ${
          transparent ? 'checkerboard' : 'image-panel__frame--dark'
        }`}
      >
        {src && (
          <img
            src={src}
            alt={alt}
            className={`image-panel__img ${loaded ? 'is-loaded' : ''}`}
            onLoad={() => setLoaded(true)}
          />
        )}
        {children}
      </div>

      {(label || meta) && (
        <figcaption className="image-panel__caption">
          {label && <span className="image-panel__label">{label}</span>}
          {meta && <span className="image-panel__meta">{meta}</span>}
        </figcaption>
      )}
    </figure>
  )
}
