import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase"; // Assuming you have Firestore set up

export const getUserPurchaseHistory = async (userEmail) => {
  if (!userEmail) {
    throw new Error("User is not logged in");
  }

  try {
    // Query the orders collection where customerInfo.email matches the provided userEmail
    const purchasesQuery = query(
      collection(firestore, "orders"), // Assuming 'orders' collection holds the order data
      where("customerInfo.email", "==", userEmail)
    );

    const purchaseDocs = await getDocs(purchasesQuery);
    if (purchaseDocs.empty) {
      return []; // No purchase history found for the user
    }

    // Map through each document and return relevant purchase history data
    return purchaseDocs.docs.flatMap((doc) => {
      const order = doc.data();
      return order.cart.map((item) => ({
        productId: item.id, // product ID
        discountedItems: item.discountedQuantity || 0, // items that were discounted
        usageCount: item.quantity || 0, // total quantity purchased
      }));
    });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    return [];
  }
};
