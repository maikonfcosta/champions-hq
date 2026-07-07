import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '500px', noPadding = false }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="premium-modal-overlay" onClick={onClose}>
      <div 
        className="premium-modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth }}
      >
        <div className={`premium-modal-header ${!title ? 'no-title' : ''}`}>
          {title && <h3 className="premium-modal-title">{title}</h3>}
          <button className="premium-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className={`premium-modal-body ${noPadding ? 'no-padding' : ''}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
