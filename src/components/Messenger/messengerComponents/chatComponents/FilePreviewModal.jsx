"use client";

import { FaUpload, FaTimes } from "react-icons/fa";

export default function FilePreviewModal({
  file,
  filePreview,
  handleFileUpload,
  handleCloseModal 
}) {
  if (!file || !filePreview) return null;

  return (
    <div className="flex flex-col items-center mb-2">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
        >
          <FaTimes className="text-white" />
        </button>
        <div className="relative">
          {file.type.startsWith("image/") && (
            <img src={filePreview} alt="Preview" className="max-w-xs" />
          )}
          {file.type.startsWith("video/") && (
            <video src={filePreview} controls className="max-w-xs" />
          )}
          {file.type.startsWith("audio/") && (
            <audio src={filePreview} controls className="max-w-xs" />
          )}
          {file.type.startsWith("application/") && (
            <p className="max-w-xs">{file.name}</p>
          )}
        </div>
        <button
          onClick={handleFileUpload}
          className="bg-green-500 text-white p-2 rounded-lg mt-2 flex items-center"
        >
          <FaUpload className="mr-2" /> Upload
        </button>
      </div>
    </div>
  );
}
