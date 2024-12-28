import { firestore, storage } from "@/firebase";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Fetch user or admin data by uniqueId
export const fetchUserData = async (userId) => {
  try {
    const userDocRef = doc(firestore, "users", userId); // or 'admins'
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      return { id: userSnapshot.id, ...userSnapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user/admin data:", error);
    throw new Error("Failed to fetch user/admin data");
  }
};

export const fetchSellerByUniqueId = async (sellerId) => {
  const sellerQuery = query(
    collection(firestore, "admins"),
    where("uniqueId", "==", sellerId)
  );
  const sellerDocs = await getDocs(sellerQuery);
  // If an admin is found, use the first matching document

  const sellerDocRef = doc(firestore, "admins", sellerDocs.docs[0].id);

  return sellerDocRef;
};

// Update user or admin details
export const updateUserData = async (userId, userData) => {
  try {
    const userDocRef = doc(firestore, "users", userId); // or 'admins'
    await updateDoc(userDocRef, userData);
    console.log("User data updated successfully.");
    return userData;
  } catch (error) {
    console.error("Error updating user/admin data:", error);
    throw new Error("Failed to update user/admin data");
  }
};

// Delete user or admin account
export const deleteUserData = async (userId) => {
  try {
    const userDocRef = doc(firestore, "users", userId); // or 'admins'
    await deleteDoc(userDocRef);
    console.log("User/admin account deleted successfully.");
  } catch (error) {
    console.error("Error deleting user/admin account:", error);
    throw new Error("Failed to delete user/admin account");
  }
};
