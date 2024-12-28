import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase";

// Query Firestore to fetch the user/admin by uniqueId in the document data
export const getUserProfileByUniqueId = async (uniqueId) => {
  try {
    // Query 'users' collection
    const usersQuery = query(
      collection(firestore, "users"),
      where("uniqueId", "==", uniqueId)
    );
    const usersSnapshot = await getDocs(usersQuery);

    if (!usersSnapshot.empty) {
      // Found a matching user document
      return {
        id: usersSnapshot.docs[0].id,
        ...usersSnapshot.docs[0].data(),
      };
    }

    // Query 'admins' collection if no user found
    const adminsQuery = query(
      collection(firestore, "sellers"),
      where("uniqueId", "==", uniqueId)
    );
    const adminsSnapshot = await getDocs(adminsQuery);

    if (!adminsSnapshot.empty) {
      // Found a matching admin document
      return {
        id: adminsSnapshot.docs[0].id,
        ...adminsSnapshot.docs[0].data(),
      };
    }
  } catch (error) {
    console.error("Error fetching user/admin profile:", error);
  }
  return null;
};

export const fetchAllAdmins = async () => {
  try {
    const adminsQuery = query(collection(firestore, "sellers"));
    const adminsSnapshot = await getDocs(adminsQuery);
    const admins = adminsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return admins;
  } catch (error) {
    console.error("Error fetching admins:", error);
  }
  return [];
};
