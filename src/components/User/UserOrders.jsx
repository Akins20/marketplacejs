"use client";
import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { firestore } from "@/firebase"; // Adjust to your Firebase config path

const Orders = ({ orderIds }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch order details from Firestore for each orderId
  const fetchOrderDetails = async () => {
    try {
      const fetchedOrders = await Promise.all(
        orderIds.map(async (orderId) => {
          const orderRef = doc(firestore, "orders", orderId);
          const orderSnap = await getDoc(orderRef);
          if (orderSnap.exists()) {
            return { id: orderId, ...orderSnap.data() };
          } else {
            return null; // Handle case if order doesn't exist
          }
        })
      );
      setOrders(fetchedOrders.filter(Boolean)); // Filter out any null orders
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderIds.length > 0) {
      fetchOrderDetails();
    }
  }, [orderIds]);

  return (
    <section className="bg-white shadow-md rounded-md p-6 mb-10">
      <h2 className="text-xl font-semibold mb-4">
        <FaBoxOpen className="inline mr-2 text-blue-500" />
        Your Orders
      </h2>
      {loading ? (
        <p className="text-gray-600">Loading your orders...</p>
      ) : orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="block font-semibold text-lg">
                  {order.product || "Product Details"}
                </span>
                <span
                  className={`py-1 px-3 rounded-full text-white text-sm ${
                    order.status === "Delivered"
                      ? "bg-green-500"
                      : order.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </div>
              <div className="text-gray-700 mb-2">
                <p>
                  Transaction Reference:{" "}
                  <span className="font-semibold">
                    {order.transactionReference}
                  </span>
                </p>
                <p>
                  Delivery Address: {order.deliveryInfo.address},{" "}
                  {order.deliveryInfo.city}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <p>
                  Ordered on:{" "}
                  {new Date(
                    order.timestamp?.seconds * 1000
                  ).toLocaleDateString()}
                </p>
                <p>Total Amount: ₦{order.totalAmount / 100}</p>
              </div>
              <ul className="mt-4 space-y-2">
                {order.cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>
                      {item.title} ({item.quantity} pcs)
                    </span>
                    <span className="text-green-600">
                      ₦{item.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You have no orders at the moment.</p>
      )}
    </section>
  );
};

export default Orders;
