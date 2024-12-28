"use client";

import { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import {
  FaPaperPlane,
  FaPaperclip,
  FaMicrophone,
  FaVideo,
  FaCamera,
  FaFile,
  FaStop,
} from "react-icons/fa";
import FilePreviewModal from "./FilePreviewModal";
import VideoPreviewModal from "./VideoComponents/VideoPreviewModal";
import {
  startRecording,
  stopRecording,
  startVideoRecording,
  captureImage,
} from "../../chatFunctions/chatUtils";

export default function MessageInput({
  content,
  setContent,
  handleSend,
  handleTyping,
}) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isDropupOpen, setIsDropupOpen] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        handleSend(downloadURL, file.type);
        setFile(null);
        setFilePreview(null);
        setUploadProgress(0); // Reset progress after upload
      }
    );
  };

  const handleSendMessage = () => {
    if (content.trim() === "" && !file) return; // Do not send empty messages

    handleSend(content || file, file ? file.type : null);
    setContent("");
  };

  const handleToggleDropup = () => {
    setIsDropupOpen(!isDropupOpen);
  };

  useEffect(() => {
    if (!recording) {
      stopRecording(mediaRecorder);
      return;
    }

    startRecording(setMediaRecorder, setFile, setFilePreview);
  }, [recording]);

  const handleVideoRecord = async () => {
    setIsDropupOpen(false);
    const videoStream = await startVideoRecording(
      setMediaRecorder,
      setFile,
      setFilePreview
    );
    setVideoPreview(videoStream);
  };

  const handleImageCapture = async () => {
    setIsDropupOpen(false);
    await captureImage(setFile, setFilePreview);
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleSendVideo = async () => {
    if (!file) return;

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        handleSend(downloadURL, file.type);
        setFile(null);
        setFilePreview(null);
        setVideoPreview(null);
        setUploadProgress(0); // Reset progress after upload
      }
    );
  };

  const handleCloseModal = () => {
    setFile(null);
    setFilePreview(null);
    setVideoPreview(null);
  };

  return (
    <div className="relative bottom-0 w-auto flex flex-col p-1 border-t bg-slate-400 items-center">
      <FilePreviewModal
        file={file}
        filePreview={filePreview}
        handleFileUpload={handleFileUpload}
        handleCloseModal={handleCloseModal}
      />
      <VideoPreviewModal
        videoPreview={videoPreview}
        handleStopRecording={handleStopRecording}
        handleSendVideo={handleSendVideo}
        handleCloseModal={handleCloseModal}
      />
      <div className="flex w-full items-center relative">
        {/* <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="hidden"
        /> */}
        <label htmlFor="file-upload" className="mr-2 cursor-pointer">
          <FaPaperclip
            className="text-gray-900 text-xl"
            onClick={handleToggleDropup}
          />
        </label>
        {isDropupOpen && (
          <div className="absolute bottom-full mb-2 bg-white border rounded-lg shadow-lg p-2">
            <button
              className="flex items-center space-x-2 mb-2"
              onClick={handleVideoRecord}
            >
              <FaVideo className="text-blue-500" />
              <span>Record Video</span>
            </button>
            <button
              className="flex items-center space-x-2 mb-2"
              onClick={handleImageCapture}
            >
              <FaCamera className="text-green-500" />
              <span>Take Photo</span>
            </button>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              className="flex items-center space-x-2"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <FaFile className="text-gray-500" />
              <span>Send File</span>
            </button>
          </div>
        )}
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message"
          className="border p-2 flex-grow rounded-lg mr-2"
          onKeyDown={(e) => handleTyping(true)}
          onKeyUp={(e) => handleTyping(false)}
        />
        <button
          onClick={() => setRecording(!recording)}
          className={`bg-${
            recording ? "red" : "blue"
          }-500 text-white p-2 rounded-lg mr-2`}
        >
          <FaMicrophone className="text-white" />
        </button>
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          <FaPaperPlane className="text-white" />
        </button>
      </div>
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
