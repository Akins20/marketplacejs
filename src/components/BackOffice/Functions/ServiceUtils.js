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

// Create a service and add the service ID to the seller's document
export const createService = async (serviceData, sellerId) => {
  try {
    const servicesCollectionRef = collection(firestore, "services");
    const serviceId = uuidv4();
    const creationDate = new Date();

    // Add service data to Firestore
    const serviceDocRef = await setDoc(doc(servicesCollectionRef, serviceId), {
      ...serviceData,
      id: serviceId,
      sellerId, // Reference to the seller
      creationDate,
    });

    // Fetch the seller document by sellerId
    const sellerDocRef = await fetchSellerByUniqueId(sellerId);

    // Add the service ID to the seller's services array
    await updateDoc(sellerDocRef, {
      services: arrayUnion(serviceId),
    });

    console.log("Service created and added to seller's document.");
    return serviceDocRef;
  } catch (error) {
    console.error("Error creating service:", error);
    throw new Error("Failed to create service");
  }
};

// Update service data in Firestore
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

// Fetch services by sellerId
export const fetchProviderServices = async (sellerId) => {
  try {
    const servicesCollection = collection(firestore, "services");
    const q = query(servicesCollection, where("sellerId", "==", sellerId)); // Query by sellerId
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

// Delete a service and remove reference from the seller's document
export const deleteService = async (serviceId, sellerId) => {
  try {
    const serviceDocRef = doc(firestore, "services", serviceId);
    await deleteDoc(serviceDocRef);

    // Remove the service ID from the seller's services array
    const sellerDocRef = doc(firestore, "users", sellerId); // Adjust the collection to "admins" if necessary
    await updateDoc(sellerDocRef, {
      services: arrayRemove(serviceId),
    });

    console.log(
      "Service deleted and reference removed from seller's document."
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Failed to delete service");
  }
};

// Upload multiple images to Firebase Storage and return URLs
export const uploadImageToFirebase = async (file) => {
  try {
    const storageRef = ref(storage, `services/${uuidv4()}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};
