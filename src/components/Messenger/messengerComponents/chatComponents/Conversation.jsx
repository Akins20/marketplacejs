import React, { useEffect, useState } from "react";
import MessageList from "./Message/MessageList";
import MessageInput from "./MessageInput";
import { useConversation } from "@/hooks/useConversation"; // Import the new hook
import Image from "next/image";
import UserImg from "@/assets/userImage.jpg";
import Link from "next/link";
import { getUserProfileByUniqueId } from "@/utils/usersUtils";

function Conversation({ recipient, currentUser, isFromService }) {
  const {
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
  } = useConversation(currentUser, recipient); // Use the hook

  const [recipientProfile, setRecipientProfile] = useState({});
  useEffect(() => {
    const getRecipientProfile = async () => {
      const data = await getUserProfileByUniqueId(recipient.uniqueId);
      setRecipientProfile(data);
    };
    getRecipientProfile();
  }, [recipient.uniqueId]);

  return (
    <div className="flex-1 flex flex-col py-0 px-0 bg-white rounded-tl border-gray-300 mx-0">
      <div className="p-4 flex items-center bg-green-600 text-white rounded-tl mx-0">
        <div className="">
          <Image
            src={
              recipientProfile?.adminImage ||
              recipientProfile?.userImage ||
              UserImg
            }
            width={50}
            height={50}
            className="rounded-full mr-2"
            alt="User Avatar"
          />
        </div>
        <div className="flex items-start flex-col">
          <p className="text-xl font-semibold text-white">
            {recipient?.username}
          </p>
          <p className="text-sm text-gray-200">
            {onlineStatus
              ? "Online"
              : lastSeen
              ? formatLastSeen(lastSeen)
              : "Offline"}
          </p>
        </div>
        <Link href={`/${recipient?.uniqueId}`} className="ml-auto my-auto text-white">
          View Profile
        </Link>
      </div>

      <div ref={messageListRef} className="flex-grow overflow-y-auto mb-16">
        <MessageList
          messages={messages}
          recipient={recipient}
          typingStatus={typingStatus}
        />
      </div>

      <div className="absolute bottom-0 w-auto z-10 text-black">
        <MessageInput
          content={content}
          setContent={setContent}
          handleSend={sendMessage}
          handleTyping={handleTyping}
        />
      </div>
    </div>
  );
}

export default Conversation;
