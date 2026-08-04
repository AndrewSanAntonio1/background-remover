import './Loader.css'

/**
 * Processing overlay: scanning beam over the image plus a progress readout.
 * `progress` is the upload percentage; once it hits 100 the copy switches to
 * "processing", since the server is then doing the work.
 */
export default function Loader({ progress = null, label }) {
  const uploading = progress !== null && progress < 100

  const text =
    label || (uploading ? `Uploading… ${progress}%` : 'Removing background…')

  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__scanner" aria-hidden="true">
        <span className="loader__beam" />
      </div>

      <div className="loader__spinner" aria-hidden="true">
        <span className="loader__ring" />
        <span className="loader__ring loader__ring--delayed" />
        <span className="loader__core" />
      </div>

      <p className="loader__text">{text}</p>

      {uploading && (
        <div
          className="loader__bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className="loader__bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <p className="loader__hint">This usually takes a few seconds.</p>
    </div>
  )
}
