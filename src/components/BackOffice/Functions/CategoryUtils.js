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

// Fetch all categories from Firestore
export const fetchCategories = async () => {
  try {
    const categoriesCollection = collection(firestore, "categories");
    const querySnapshot = await getDocs(categoriesCollection);
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const categoriesCollection = collection(firestore, "categories");
    const categoryId = uuidv4();
    await setDoc(doc(categoriesCollection, categoryId), {
      id: categoryId,
      ...categoryData,
    });
    console.log("Category created successfully.");
    return categoryId;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const categoryDocRef = doc(firestore, "categories", categoryId);
    await updateDoc(categoryDocRef, categoryData);
    console.log("Category updated successfully.");
    return categoryData;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  try {
    const categoryDocRef = doc(firestore, "categories", categoryId);
    await deleteDoc(categoryDocRef);
    console.log("Category deleted successfully.");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};
