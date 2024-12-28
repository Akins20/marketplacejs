"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { FaExpand, FaFile, FaCheck, FaCheckDouble } from "react-icons/fa";
import Modal from "./Modal";

export default function MessageList({ messages, recipient, typingStatus }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenContent, setFullscreenContent] = useState(null);
  const messageListRef = useRef(null); // Ref to track the message list container

  // Effect to scroll to the bottom when messages update
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const openFullscreen = (content, type) => {
    setFullscreenContent({ content, type });
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenContent(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <FaCheck className="text-gray-500" />;
      case "delivered":
        return <FaCheckDouble className="text-gray-500" />;
      case "read":
        return <FaCheckDouble className="text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      ref={messageListRef}
      key={messageListRef.current}
      className="flex flex-col mt-4 p-2 space-y-2 h-full overflow-y-auto bg-white"
    >
      {" "}
      {messages?.map((msg) => (
        <div
          key={msg.id}
          className={`p-2 rounded-md max-w-[75%] ${
            msg.to === recipient.uniqueId
              ? "bg-blue-500 text-white self-end"
              : "bg-gray-200 text-black self-start"
          }`}
        >
          <strong>{msg.to === recipient.uniqueId ? "You" : recipient.username}</strong>:{" "}
          {msg?.type === "text" ? (
            msg?.content
          ) : msg?.fileType?.startsWith("image/") ? (
            <div className="relative">
              <Image
                src={msg.content}
                width={200}
                height={200}
                alt="Uploaded media"
                className="max-w-xs"
              />
              <button
                className="absolute top-1 right-1 text-gray-500"
                onClick={() => openFullscreen(msg.content, "image")}
              >
                <FaExpand />
              </button>
            </div>
          ) : msg?.fileType?.startsWith("video/") ? (
            <div className="relative">
              <video src={msg.content} controls className="max-w-xs" />
              <button
                className="absolute top-1 right-1 text-gray-500"
                onClick={() => openFullscreen(msg.content, "video")}
              >
                <FaExpand />
              </button>
            </div>
          ) : msg?.fileType?.startsWith("audio/") ? (
            <div className="relative">
              <audio src={msg.content} controls className="max-w-xs" />
            </div>
          ) : msg?.fileType?.startsWith("application/") ? (
            <div className="flex items-center space-x-2">
              <FaFile className="w-5 h-5 text-blue-500" />
              <a
                href={msg.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Open Document
              </a>
            </div>
          ) : (
            <span>{msg.content}</span>
          )}
          <div className="flex justify-between items-center mt-1 text-xs space-x-6">
            <span className="text-xs text-gray-800">
              {formatTimestamp(msg.createdAt)}
            </span>
            {msg.from === recipient.uniqueId && getStatusIcon(msg.status)}
          </div>
        </div>
      ))}
      {typingStatus && (
        <div className="self-start text-sm text-gray-500">Typing...</div>
      )}
      {isFullscreen && (
        <Modal onClose={closeFullscreen}>
          {fullscreenContent.type === "image" ? (
            <Image
              src={fullscreenContent.content}
              width={500}
              height={500}
              alt="Fullscreen"
            />
          ) : fullscreenContent.type === "video" ? (
            <video
              src={fullscreenContent.content}
              controls
              className="w-full"
            />
          ) : null}
        </Modal>
      )}
    </div>
  );
}
