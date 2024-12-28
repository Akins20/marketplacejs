"use client";

import React from "react";

const PillSwitcher = ({ selectedMode, onSelectMode }) => {
  return (
    <div className="flex justify-center my-4 space-x-4">
      <button
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedMode === "products" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => onSelectMode("products")}
      >
        Products
      </button>
      <button
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedMode === "services" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => onSelectMode("services")}
      >
        Services
      </button>
    </div>
  );
};

export default PillSwitcher;
