import React, { useState } from 'react';

// SVG Icons untuk tiap tipe alert
const Icons = {
  info: (
    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
    </svg>
  ),
  success: (
    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
    </svg>
  ),
  warning: (
    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
    </svg>
  ),
  error: (
    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
    </svg>
  ),
};

// Map style Tailwind berdasarkan variant
const styles = {
  info: {
    container: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800',
    button: 'bg-blue-50 text-blue-500 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700',
  },
  success: {
    container: 'bg-green-50 text-green-800 border-green-200 dark:bg-gray-800 dark:text-green-400 dark:border-green-800',
    button: 'bg-green-50 text-green-500 hover:bg-green-200 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700',
  },
  warning: {
    container: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-gray-800 dark:text-amber-300 dark:border-amber-800',
    button: 'bg-amber-50 text-amber-500 hover:bg-amber-200 dark:bg-gray-800 dark:text-amber-300 dark:hover:bg-gray-700',
  },
  error: {
    container: 'bg-red-50 text-red-800 border-red-200 dark:bg-gray-800 dark:text-red-400 dark:border-red-800',
    button: 'bg-red-50 text-red-500 hover:bg-red-200 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700',
  },
};

export default function Alert  ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const currentStyle = styles[variant] || styles.info;

  return (
    <div
      className={`flex items-start p-4 mb-4 text-sm rounded-lg border ${currentStyle.container}`}
      role="alert"
    >
      {/* Icon */}
      <div className="me-3 mt-0.5">{Icons[variant] || Icons.info}</div>

      {/* Content */}
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <div>{children}</div>
      </div>

      {/* Tombol Dismiss/Close */}
      {dismissible && (
        <button
          type="button"
          onClick={handleClose}
          className={`ms-auto -mx-1.5 -my-1.5 p-1.5 inline-flex items-center justify-center h-8 w-8 rounded-lg focus:ring-2 focus:ring-offset-1 transition-colors ${currentStyle.button}`}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      )}
    </div>
  );
};