import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const Modal = ({ isOpen, onClose, title, children }) => {
  const closeRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    triggerRef.current = document.activeElement
    closeRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      triggerRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white w-full sm:max-w-2xl max-h-[92svh] sm:max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 shrink-0">
          <h2 id="modal-title" className="text-xl font-bold uppercase tracking-tight">
            {title}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            aria-label="Zamknij"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-6">
          {children}
        </div>

      </div>
    </div>,
    document.body
  )
}

export default Modal
