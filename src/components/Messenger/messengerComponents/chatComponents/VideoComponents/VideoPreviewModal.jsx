import React from "react";
import { FaTimes, FaStop, FaPaperPlane } from "react-icons/fa";

export default function VideoPreviewModal({
  videoPreview,
  handleStopRecording,
  handleSendVideo,
  handleCloseModal,
}) {
  if (!videoPreview) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
        >
          <FaTimes className="text-white" />
        </button>
        <video
          src={videoPreview}
          controls
          className="w-full h-auto mb-4"
          autoPlay
          loop
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleStopRecording}
            className="bg-red-500 text-white p-2 rounded-lg"
          >
            <FaStop className="text-white" />
            <span className="ml-2">Stop</span>
          </button>
          <button
            onClick={handleSendVideo}
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            <FaPaperPlane className="text-white" />
            <span className="ml-2">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
