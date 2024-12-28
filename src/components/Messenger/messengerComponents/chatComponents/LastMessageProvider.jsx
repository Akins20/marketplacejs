import React from "react";
import UserListItem from "./UserListItem";
import UserImg from "@/assets/userImage.jpg";

const LastMessageProvider = ({
  serviceProviders,
  lastMessages,
  userProfiles,
  onSelectUser,
}) => {
  // Create a Set to track unique user IDs to avoid duplicates
  const renderedUserIds = new Set();

  return (
    <>
      {/* Render service providers if they haven't already been rendered */}
      {serviceProviders.map((provider) => {
        const isRendered = renderedUserIds.has(provider.uniqueId);

        // Add provider ID to the Set to prevent future duplicates
        if (!isRendered) {
          renderedUserIds.add(provider.uniqueId);

          return (
            <UserListItem
              key={provider.uniqueId}
              user={provider}
              lastMessage={lastMessages[provider.uniqueId]}
              userImage={provider.userImage || provider.adminImage || UserImg}
              onSelectUser={onSelectUser}
            />
          );
        }

        return null; // Avoid rendering duplicates
      })}

      {/* Render conversations from lastMessages if they haven't already been rendered */}
      {Object.keys(lastMessages).map((recipientId) => {
        const recipientProfile = userProfiles[recipientId];
        const isRendered = renderedUserIds.has(recipientId);

        // Add recipient ID to the Set to prevent future duplicates
        if (!isRendered) {
          renderedUserIds.add(recipientId);

          return (
            <UserListItem
              key={recipientId}
              user={{ uniqueId: recipientId, ...recipientProfile }}
              lastMessage={lastMessages[recipientId]}
              userImage={
                recipientProfile?.adminImage ||
                recipientProfile?.userImage ||
                UserImg
              }
              onSelectUser={onSelectUser}
            />
          );
        }

        return null; // Avoid rendering duplicates
      })}
    </>
  );
};

export default LastMessageProvider;
