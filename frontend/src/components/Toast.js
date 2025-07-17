import React, { useEffect } from 'react';

export default function Toast({ show, message, color = 'success', onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div
      className={`position-fixed top-0 end-0 m-3 shadow bg-${color} text-white px-4 py-3 rounded`}
      style={{ zIndex: 9999, minWidth: 250, transition: 'all 0.3s' }}
      role="alert"
    >
      <span className="me-2">
        {color === 'success' ? '✔️' : '⚠️'}
      </span>
      {message}
    </div>
  );
} 