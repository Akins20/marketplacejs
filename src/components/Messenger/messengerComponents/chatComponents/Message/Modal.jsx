import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg overflow-hidden w-auto max-w-3xl mx-auto">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
