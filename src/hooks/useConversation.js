import { useState, useEffect, useRef, useMemo } from "react";
import { db } from "@/firebase";
import {
  onDisconnect,
  set,
  push,
  serverTimestamp,
  ref,
  onValue,
} from "firebase/database";
import { createConversationId } from "@/utils/messageUtils"; // Helper function for generating conversation ID

export const useConversation = (currentUser, recipient) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [typingStatus, setTypingStatus] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(null);
  const [lastSeen, setLastSeen] = useState(null);
  const messageListRef = useRef(null);

  // Sanitize uniqueId for both recipient and currentUser
  const sanitizedRecipient = useMemo(
    () => recipient?.uniqueId?.replace(/[.#$[\]]/g, "").toLowerCase(),
    [recipient]
  );
  const sanitizedCurrentUser = useMemo(
    () => currentUser?.uniqueId?.replace(/[.#$[\]]/g, "").toLowerCase(),
    [currentUser]
  );

  // Generate a conversation ID based on both users' unique IDs
  const conversationId = useMemo(
    () => createConversationId(sanitizedCurrentUser, sanitizedRecipient),
    [sanitizedCurrentUser, sanitizedRecipient]
  );

  // Fetch messages and listen for changes
  useEffect(() => {
    if (!conversationId) return;

    const messagesRef = ref(db, `messages/${conversationId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const conversationMessages = Object.values(data || {});
      setMessages(conversationMessages);

      // Scroll to the bottom of the message list
      setTimeout(() => {
        messageListRef.current?.scrollTo({
          top: messageListRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    });

    return () => unsubscribe();
  }, [conversationId]);

  // Listen for typing status changes
  useEffect(() => {
    const typingRef = ref(db, `typingStatus/${sanitizedRecipient}`);
    const unsubscribe = onValue(typingRef, (snapshot) => {
      const typingData = snapshot.val();
      setTypingStatus(
        typingData?.isTyping && typingData?.uniqueId !== currentUser.uniqueId
      );
    });

    return () => unsubscribe();
  }, [sanitizedRecipient, currentUser]);

  // Listen for online/offline status
  useEffect(() => {
    const recipientStatusRef = ref(db, `onlineUsers/${sanitizedRecipient}`);
    const unsubscribe = onValue(recipientStatusRef, (snapshot) => {
      const data = snapshot.val();
      setOnlineStatus(data?.online);
      setLastSeen(data?.lastSeen);
    });

    return () => unsubscribe();
  }, [sanitizedRecipient]);

  // Function to send a message
  const sendMessage = async (messageContent, fileType = null) => {
    const messageType = fileType ? "media" : "text";
    const messageContentValue =
      messageType === "media" ? messageContent : content;

    if (messageContentValue.trim() === "") return;

    const newMessageRef = push(ref(db, `messages/${conversationId}`));
    await set(newMessageRef, {
      content: messageContentValue,
      type: messageType,
      fileType: fileType || null,
      from: currentUser.uniqueId,
      to: recipient.uniqueId,
      createdAt: serverTimestamp(),
      status: "sent",
    });

    setContent(""); // Clear the input field after sending
  };

  // Function to handle typing status
  const handleTyping = async (isTyping) => {
    const typingRef = ref(db, `typingStatus/${sanitizedCurrentUser}`);
    await set(typingRef, { isTyping, uniqueId: sanitizedCurrentUser });
    onDisconnect(typingRef).remove();
  };

  // Utility to format last seen time
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return `Last seen at ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} on ${date.toDateString()}`;
  };

  return {
    messages,
    content,
    setContent,
    sendMessage,
    typingStatus,
    handleTyping,
    onlineStatus,
    lastSeen,
    formatLastSeen,
    messageListRef,
  };
};
