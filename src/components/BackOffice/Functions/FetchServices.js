import { firestore, storage } from "@/firebase"; // Adjust this path to your firebase config file
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Function to update service data in Firestore
export const updateServiceData = async (serviceId, serviceData) => {
  try {
    const serviceDocRef = doc(firestore, "services", serviceId);
    await updateDoc(serviceDocRef, serviceData);
    console.log("Service data updated successfully.");
    return serviceData;
  } catch (error) {
    console.error("Error updating service data:", error);
    throw new Error("Failed to update service data");
  }
};

// Function to fetch categories from Firestore
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

// Function to upload a single image to Firebase Storage
export const uploadImageToFirebase = async (image) => {
  try {
    const storageRef = ref(storage, `services/${uuidv4()}`);
    const snapshot = await uploadBytes(storageRef, image);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

// Function to upload service data to Firestore with a random ID and image URLs
export const uploadServiceData = async (serviceData) => {
  try {
    // Upload the service data to Firestore
    const servicesCollectionRef = collection(firestore, "services");
    const serviceDocRef = await setDoc(
      servicesCollectionRef,
      serviceData.id,
      serviceData
    );

    return { ...serviceData, id: serviceDocRef.id };
  } catch (error) {
    console.error("Error uploading service data:", error);
    throw new Error("Failed to upload service data");
  }
};

// Function to fetch provider services by adminEmail
export const fetchProviderServices = async (sellerEmail) => {
  try {
    const servicesCollection = collection(firestore, "services");
    const q = query(servicesCollection, where("sellerEmail", "==", sellerEmail));
    const querySnapshot = await getDocs(q);
    const services = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log("Services fetched successfully.");
    return services;
  } catch (error) {
    console.error("Error fetching provider services:", error);
    return [];
  }
};

// Function to delete a service from Firestore
export const deleteService = async (serviceId) => {
  try {
    const serviceDocRef = doc(firestore, "services", serviceId);
    await deleteDoc(serviceDocRef);
    console.log("Service deleted successfully.");
    return { message: "Service deleted successfully" };
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Failed to delete service");
  }
};
// Function to convert image to base64
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
