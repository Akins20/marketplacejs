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
import { fetchSellerByUniqueId } from "./UserUtils";

// Create a product and add reference to seller's document
export const createProduct = async (productData, sellerId) => {
  try {
    const productsCollectionRef = collection(firestore, "products");
    const productId = uuidv4();
    const creationDate = new Date();

    // Add product data to Firestore
    const productDocRef = await setDoc(doc(productsCollectionRef, productId), {
      ...productData,
      id: productId,
      sellerId,
      creationDate,
      productStatus: "active", // Default status
    });

    const sellerDocRef = await fetchSellerByUniqueId(sellerId);
    // Add the service ID to the seller's services array
    await updateDoc(sellerDocRef, {
      products: arrayUnion(productId),
    });

    console.log("Product created and added to seller's document.");
    return productDocRef;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};

// Delete product and remove reference from seller's document
export const deleteProduct = async (productId, sellerId) => {
  try {
    const productDocRef = doc(firestore, "products", productId);
    await deleteDoc(productDocRef);

    // Remove the product ID from seller's products array
    const sellerDocRef = await fetchSellerByUniqueId(sellerId);
    await updateDoc(sellerDocRef, {
      products: arrayRemove(productId),
    });

    console.log(
      "Product deleted and reference removed from seller's document."
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};
