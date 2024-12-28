import { db } from "@/firebase";
import { ref, onValue } from "firebase/database";
import { getUserProfileByUniqueId } from "./usersUtils";

export const fetchMessageRecipientAndMessages = async (
  sellerId,
  currentUser,
  setRecipient,
  setMessages,
  setLoadingMessages
) => {
  setLoadingMessages(true);

  try {
    // Fetch recipient profile using sellerId
    const receiver = await getUserProfileByUniqueId(sellerId);
    console.log("Fetched Recipient: ", receiver);

    // Set recipient state after fetching
    setRecipient(receiver);

    // Create conversation ID based on the currentUser and the fetched receiver
    const conversationId = createConversationId(
      currentUser?.uniqueId,
      receiver?.uniqueId
    );

    // Fetch messages using the conversationId
    fetchMessages(conversationId, setMessages, setLoadingMessages);
  } catch (error) {
    console.error("Error fetching recipient:", error);
    setLoadingMessages(false);
  }
};

export const createConversationId = (user1, user2) => {
  // Generate a conversation ID by sorting the unique IDs of the users.
  return [user1, user2].sort().join("_");
};

export const fetchMessages = (
  conversationId,
  setMessages,
  setLoadingMessages
) => {
  const messagesRef = ref(db, `messages/${conversationId}`);

  onValue(
    messagesRef,
    (snapshot) => {
      const data = snapshot.val();
      const fetchedMessages = Object.keys(data || {}).map((key) => ({
        id: key,
        ...data[key],
      }));

      setMessages(fetchedMessages);
      setLoadingMessages(false);
    },
    (error) => {
      console.error("Error fetching messages:", error);
      setLoadingMessages(false);
    }
  );
};
