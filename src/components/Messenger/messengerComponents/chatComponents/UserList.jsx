import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { onValue, ref } from "firebase/database";
import { fetchAllAdmins, getUserProfileByUniqueId } from "@/utils/usersUtils";
import LastMessageProvider from "./LastMessageProvider";
import useProvideAuth from "@/components/generalUtils/useAuth";

function UserList({ onSelectUser, currentUser }) {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [userProfiles, setUserProfiles] = useState({});
  const { user } = useProvideAuth();

  // Fetch service providers (admins) if the current user is not an admin.
  useEffect(() => {
    const fetchServiceProviders = async () => {
      if (user) {
        const providers = await fetchAllAdmins();
        setServiceProviders(providers);
      }
    };
    fetchServiceProviders();
  }, [user]);

  // Fetch last messages and user profiles for ongoing conversations.
  useEffect(() => {
    const messagesRef = ref(db, "messages");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const lastMessages = {};
      const profilesToFetch = new Set();

      if (data) {
        Object.entries(data).forEach(([conversationId, messages]) => {
          const lastMessageKey = Object.keys(messages).pop();
          const lastMessage = messages[lastMessageKey];

          // Check if the current user is involved in the conversation.
          if (
            lastMessage.to === currentUser?.uniqueId ||
            lastMessage.from === currentUser?.uniqueId
          ) {
            const recipientId =
              lastMessage.from === currentUser?.uniqueId
                ? lastMessage.to
                : lastMessage.from;

            lastMessages[recipientId] = lastMessage.content;
            profilesToFetch.add(recipientId);
          }
        });

        // Fetch user profiles if not already loaded.
        profilesToFetch.forEach((id) => {
          if (!userProfiles[id]) {
            getUserProfileByUniqueId(id).then((profile) => {
              setUserProfiles((prev) => ({ ...prev, [id]: profile }));
            });
          }
        });

        setLastMessages(lastMessages);
      }
    });

    return () => unsubscribe();
  }, [currentUser?.uniqueId, userProfiles]);

  return (
    <div className="flex flex-col h-full overflow-y-auto py-2 bg-gray-100">
      <LastMessageProvider
        serviceProviders={serviceProviders}
        lastMessages={lastMessages}
        userProfiles={userProfiles}
        onSelectUser={onSelectUser}
      />
    </div>
  );
}

export default UserList;
