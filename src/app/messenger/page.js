"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ref, onValue, set, serverTimestamp } from "firebase/database";
import { db } from "@/firebase";
import Chat from "@/components/Messenger/messengerComponents/Chat";
import useProvideAuth from "@/components/generalUtils/useAuth";

const ConversationsPage = () => {
  const { user, admin } = useProvideAuth();
  const [isTyping, setIsTyping] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = user ? user : admin;

  const sanitizedRecipient = useMemo(
    () => selectedUser?.uniqueId?.replace(/[.#$[\]]/g, ""),
    [selectedUser]
  );

  // Handle typing status
  useEffect(() => {
    if (currentUser && selectedUser) {
      const typingRef = ref(db, `typingStatus/${sanitizedRecipient}`);
      const unsubscribe = onValue(typingRef, (snapshot) => {
        const typingData = snapshot.val();
        setIsTyping(typingData?.isTyping);
      });

      return () => unsubscribe();
    }
  }, [currentUser, selectedUser, sanitizedRecipient]);

  // Handle online status
  useEffect(() => {
    if (currentUser && selectedUser) {
      const onlineRef = ref(db, `onlineStatus/${sanitizedRecipient}`);
      const setOnlineStatus = async () => {
        await set(onlineRef, { online: true, lastSeen: serverTimestamp() });
      };

      window.addEventListener("beforeunload", () => {
        set(onlineRef, { online: false, lastSeen: serverTimestamp() });
      });

      setOnlineStatus();
    }
  }, [currentUser, selectedUser, sanitizedRecipient]);

  return (
    <div className="min-h-screen">
      <Chat
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        isTyping={isTyping}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ConversationsPage;
