import React from "react";

const NotificationModal = ({ visible, message, success, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white p-4 rounded shadow-md ${
          success ? "text-green-600" : "text-red-600"
        }`}
      >
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
