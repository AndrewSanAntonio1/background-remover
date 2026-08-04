import { useEffect, useRef, useState } from 'react'
import { IconChevron } from './Icons'
import './FaqItem.css'

/**
 * Single accordion row. Height is animated via a measured max-height so the
 * open/close transition is smooth without hardcoding content heights.
 */
export default function FaqItem({ question, answer, isOpen, onToggle, id }) {
  const bodyRef = useRef(null)
  const [maxHeight, setMaxHeight] = useState(0)

  useEffect(() => {
    if (!bodyRef.current) return
    setMaxHeight(isOpen ? bodyRef.current.scrollHeight : 0)
  }, [isOpen, answer])

  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <h3 className="faq-item__heading">
        <button
          type="button"
          className="faq-item__trigger"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-panel-${id}`}
          id={`faq-trigger-${id}`}
        >
          <span>{question}</span>
          <span className="faq-item__chevron" aria-hidden="true">
            <IconChevron size={20} />
          </span>
        </button>
      </h3>

      <div
        className="faq-item__panel"
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-trigger-${id}`}
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <div className="faq-item__body" ref={bodyRef}>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}
