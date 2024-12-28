import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { ref, onValue } from "firebase/database";
import UserList from "./chatComponents/UserList";
import Conversation from "./chatComponents/Conversation";
import { FaArrowLeft } from "react-icons/fa";

function Chat({ selectedUser, onSelectUser, isTyping, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipientData, setRecipientData] = useState({});

  useEffect(() => {
    if (selectedUser && currentUser) {
      const conversationId = [currentUser.uniqueId, selectedUser.uniqueId]
        .sort()
        .join("_");
      const messagesRef = ref(db, `messages/${conversationId}`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const fetchedMessages = Object.keys(data || {}).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(fetchedMessages);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [selectedUser, currentUser]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* User List - Always visible on larger screens */}
      <div
        className={`${
          selectedUser ? "hidden" : "block"
        } md:block md:w-1/3 lg:w-1/4 h-full border-r border-gray-200 bg-white`}
      >
        <UserList onSelectUser={onSelectUser} currentUser={currentUser} setUserData={setRecipientData} />
      </div>

      {/* Conversation - Visible when a user is selected */}
      <div
        className={`${
          selectedUser ? "block" : "hidden"
        } md:block md:w-2/3 lg:w-3/4 h-full`}
      >
        {selectedUser ? (
          <div className="flex flex-col h-full">
            <div className="p-4 bg-gray-100 flex items-center">
              {/* Back button for mobile view */}
              <button
                onClick={() => onSelectUser(null)}
                className="md:hidden text-gray-600"
              >
                <FaArrowLeft className="text-xl mr-2" />
              </button>
              {/* <h2 className="text-xl font-semibold">{selectedUser.username}</h2> */}
            </div>
            <div className="flex-1 overflow-y-auto bg-white">
              <Conversation
                recipient={selectedUser}
                messages={messages}
                currentUser={currentUser}
                isTyping={isTyping}
                recipientProfile={recipientData}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-white">
            <p className="text-gray-500 text-lg">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
