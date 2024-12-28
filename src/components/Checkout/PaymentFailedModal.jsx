"use client";
import React from "react";
import { MdError } from "react-icons/md";

const PaymentFailedModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        {/* Error Icon */}
        <div className="flex flex-col items-center">
          <MdError className="text-red-500 text-6xl mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2 text-center dark:text-white">
            Payment Failed
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
            Unfortunately, your payment could not be processed. Please try
            again, or contact support if the issue persists.
          </p>
        </div>

        {/* Closing the Modal */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedModal;
