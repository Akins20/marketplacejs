import React from "react";
import Image from "next/image";

const UserListItem = ({ user, lastMessage, userImage, onSelectUser }) => {
  return (
    <div
      className="flex items-center p-2 mb-2 cursor-pointer hover:bg-gray-300 bg-white rounded"
      onClick={() => onSelectUser(user)}
    >
      <Image
        src={userImage}
        width={50}
        height={50}
        className="rounded-full mr-2"
        alt="User Avatar"
      />
      <div className="ml-3 flex flex-col text-black">
        <span className="font-semibold">
          {user?.username || `${user?.firstName} ${user?.lastName}`}
        </span>
        <p className="text-sm text-gray-500">
          {lastMessage
            ? lastMessage.slice(0, 30) + "..."
            : "Start a conversation"}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
