import { useState } from 'react'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false }) {
  const [isClosing, setIsClosing] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handleConfirm = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onConfirm()
    }, 200)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  return (
    <div className={`confirm-modal-overlay${isClosing ? ' closing' : ''}`} onClick={handleOverlayClick}>
      <div className={`confirm-modal${isClosing ? ' closing' : ''}`}>
        <div className="confirm-modal-body">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-cancel" onClick={handleClose}>{cancelText}</button>
          <button className={`confirm-modal-confirm${danger ? ' danger' : ''}`} onClick={handleConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
