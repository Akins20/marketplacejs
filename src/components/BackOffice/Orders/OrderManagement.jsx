import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase";

export default function OrderManagement({ user }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openOrder, setOpenOrder] = useState(null); // To toggle order items
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const ordersPerPage = 6; // Number of orders per page

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, "orders"));
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);

        // Filter orders based on user role
        const userOrders = user.isAdmin
          ? fetchedOrders
          : fetchedOrders.filter((order) =>
              order.cart.some((item) => item.sellerEmail === user.email)
            );
        setFilteredOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = orders.filter((order) =>
      order.customerInfo.name
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const toggleOrderItems = (orderId) => {
    setOpenOrder(openOrder === orderId ? null : orderId); // Toggle the open/close state for a single order
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by customer name"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring focus:ring-green-500"
      />

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {/* Orders List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-gray-50 hover:bg-gray-100 shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105"
              >
                {/* Order Summary */}
                <h2 className="text-xl font-semibold mb-2 text-green-700">
                  Order ID: {order.id}
                </h2>
                <p>
                  <strong>Customer:</strong> {order.customerInfo.name}
                </p>
                <p>
                  <strong>Total:</strong> ₦{order.totalAmount / 100}
                </p>
                <p>
                  <strong>Email:</strong> {order.customerInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.customerInfo.phone}
                </p>

                {/* Toggleable Items List */}
                <button
                  onClick={() => toggleOrderItems(order.id)}
                  className="mt-4 w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition duration-300"
                >
                  {openOrder === order.id ? "Hide Items" : "Show Items"}
                </button>

                {/* Collapsible List of Items */}
                {openOrder === order.id && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Items:</p>
                    <ul className="list-none space-y-2">
                      {order.cart.map((item) => (
                        <li
                          key={item.id}
                          className="p-2 bg-white rounded shadow"
                        >
                          <p>
                            <strong>Item ID:</strong> {item.id}
                          </p>
                          <p>
                            <strong>Product:</strong> {item.title} -{" "}
                            {item.quantity} pcs
                          </p>
                          <p>
                            <strong>Price:</strong> ₦{item.price}
                          </p>
                          <p>
                            <strong>Seller:</strong> {item.sellerEmail}
                          </p>
                          <p>
                            <strong>Brand:</strong> {item.brand}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {filteredOrders.length > ordersPerPage && (
            <div className="flex justify-between mt-6">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
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
      )}
    </div>
  );
}
