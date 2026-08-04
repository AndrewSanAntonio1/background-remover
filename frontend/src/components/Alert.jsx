import { IconAlert, IconCheck, IconClose } from './Icons'
import './Alert.css'

/**
 * Inline status message. Errors announce themselves to screen readers
 * via role="alert"; successes use the politer live region.
 */
export default function Alert({ variant = 'error', title, children, onDismiss }) {
  const Icon = variant === 'success' ? IconCheck : IconAlert

  return (
    <div
      className={`alert alert--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <span className="alert__icon">
        <Icon size={20} />
      </span>

      <div className="alert__body">
        {title && <strong className="alert__title">{title}</strong>}
        {children}
      </div>

      {onDismiss && (
        <button
          type="button"
          className="alert__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          <IconClose size={16} />
        </button>
      )}
    </div>
  )
}
