import { useEffect, useState } from "react";
import useProvideAuth from "../generalUtils/useAuth";
import UserInfo from "./UserInfo";
import Orders from "./UserOrders";
import UserCart from "./UserCart";
import UserDisplay from "./UserDisplay"; // New read-only view
import { FaUser, FaShoppingCart, FaBoxOpen, FaHome } from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useProvideAuth();
  const [userInfo, setUserInfo] = useState({});
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // Active tab state

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setUserInfo({
          id: user.id,
          name: user.username,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email,
          address: user.address || "",
          userImage: user.userImage || "",
        });
        setOrders(user.orders || []);
        setCartItems(user.cart || []);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

  const handleUpdate = (updatedInfo) => {
    setUserInfo(updatedInfo);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-green-700 text-white py-10 px-6">
        <ul className="space-y-6">
          <li className={activeTab === "profile" ? "font-bold" : ""}>
            <button
              onClick={() => setActiveTab("profile")}
              className="flex items-center space-x-3"
            >
              <FaUser />
              <span>Profile</span>
            </button>
          </li>
          <li className={activeTab === "orders" ? "font-bold" : ""}>
            <button
              onClick={() => setActiveTab("orders")}
              className="flex items-center space-x-3"
            >
              <FaBoxOpen />
              <span>Orders</span>
            </button>
          </li>
          <li className={activeTab === "cart" ? "font-bold" : ""}>
            <button
              onClick={() => setActiveTab("cart")}
              className="flex items-center space-x-3"
            >
              <FaShoppingCart />
              <span>Cart</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-10">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <>
            {activeTab === "profile" && (
              <div>
                <UserDisplay userInfo={userInfo} />
                <UserInfo userInfo={userInfo} handleUpdate={handleUpdate} />
              </div>
            )}
            {activeTab === "orders" && <Orders orderIds={orders} />}
            {activeTab === "cart" && <UserCart cartItems={cartItems} />}
          </>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
