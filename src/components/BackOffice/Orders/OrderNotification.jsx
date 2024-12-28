"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

export default function OrderNotification({ user }) {
  const [loading, setLoading] = useState(null); // To track loading state per order
  const [success, setSuccess] = useState(null);
  const [orders, setOrders] = useState([]); // State to hold orders
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const ordersPerPage = 6; // Set the number of orders per page

  // Fetch orders with pagination
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(firestore, "orders"));
        const fetchedOrders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle sending notification and generating a new notification ID
  const handleSendNotification = async (orderId) => {
    console.log("Sending notification with orderId: ", orderId);
    setLoading(orderId); // Track loading for the clicked order
    setSuccess(null);

    try {
      const newNotificationId = uuidv4(); // Generate a unique ID
      const order = orders.find((order) => order.id === orderId); // Get the correct order

      // Send notification to the API
      await fetch("/api/send-order-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerInfo: order.customerInfo,
          deliveryInfo: order.deliveryInfo,
          cart: order.cart,
          totalAmount: order.totalAmount,
          transactionReference: order.transactionReference,
        }),
      });

      // If API request is successful, store notification in Firestore
      await setDoc(doc(firestore, "order-notifications", newNotificationId), {
        id: newNotificationId,
        customerInfo: order.customerInfo,
        cart: order.cart,
        totalAmount: order.totalAmount,
        transactionReference: order.transactionReference,
        userId: user?.id || null,
        sentAt: serverTimestamp(),
      });

      // Update the orders document to store the new notification ID
      const orderDocRef = doc(firestore, "orders", order.id);
      const orderDocSnap = await getDoc(orderDocRef);

      if (orderDocSnap.exists()) {
        const existingNotificationIds =
          orderDocSnap.data().notificationIds || [];
        await updateDoc(orderDocRef, {
          notificationIds: [...existingNotificationIds, newNotificationId],
        });
      }

      setSuccess(`Notification sent for Order: ${order.transactionReference}`);
    } catch (error) {
      setSuccess("Error sending notification. Please try again.");
      console.error("Notification error:", error);
    } finally {
      setLoading(null); // Stop loading after request completion
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-6 text-gray-800">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Orders and Notifications
        </h2>

        {/* Grid Layout for Cards */}
        {currentOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-gradient-to-r from-white to-gray-100 dark:bg-gray-800 dark:from-gray-900 shadow-lg rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Order: {order.id}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Customer:</strong> {order.customerInfo.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Total Amount:</strong> ₦{order.totalAmount / 100}
                </p>

                {/* Send New Notification */}
                <button
                  onClick={() => handleSendNotification(order.id)}
                  className={`mt-4 p-2 w-full md:w-auto text-white rounded-lg transition-all duration-300 ${
                    loading === order.id
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500"
                  }`}
                  disabled={loading === order.id}
                >
                  {loading === order.id ? "Sending..." : "Send Notification"}
                </button>

                {success && (
                  <div
                    className={`mt-4 text-sm font-semibold ${
                      success.includes("Error")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {success}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
        )}

        {/* Pagination Controls */}
        {orders.length > ordersPerPage && (
          <div className="flex justify-between mt-6">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
