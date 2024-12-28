"use client";

import React from "react";
import { FiX } from "react-icons/fi";
import Loader from "@/components/Loader"; // Ensure this is imported correctly

const ChatPanel = ({ isOpen, onClose, isLoading, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 bottom-0 w-[30%] h-[70%] bg-white shadow-lg z-50 transition-transform transform translate-x-0">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
      >
        <FiX size={20} />
      </button>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      ) : (
        <div className="h-full">{children}</div>
      )}
    </div>
  );
};

export default ChatPanel;
