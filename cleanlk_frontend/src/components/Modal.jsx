/**
 * CleanLK — Reusable Modal Component
 * Accessible dialog with backdrop blur, escape-to-close, and scroll lock.
 */

import { useEffect, useCallback } from 'react'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  size = 'md',
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="clk-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`clk-modal clk-modal--${size}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="clk-modal-header">
          <h3 id="modal-title" className="clk-modal-title">
            {title}
          </h3>
          <button
            type="button"
            className="clk-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <div className="clk-modal-body">{children}</div>

        {footer && <div className="clk-modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
