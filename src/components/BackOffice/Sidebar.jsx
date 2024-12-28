"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";

export default function Sidebar({ setSelectedSection, user }) {
  const [isProductsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [isOrdersDropdownOpen, setOrdersDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleProductsDropdown = () =>
    setProductsDropdownOpen(!isProductsDropdownOpen);
  const toggleOrdersDropdown = () =>
    setOrdersDropdownOpen(!isOrdersDropdownOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);

  const handleMenuClick = (section) => {
    setSelectedSection(section);
    toggleMobileSidebar(); // Close mobile sidebar after selection
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden p-4">
        <button className="p-2 rounded-md" onClick={toggleMobileSidebar}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar Component */}
      <div
        className={`${
          isMobileSidebarOpen ? "block" : "hidden"
        } lg:block w-64 text-black bg-gradient-to-r from-gray-200 to-gray-50  min-h-screen p-6 flex flex-col transition-all duration-300 z-10`}
      >
        {/* Sidebar Title */}
        {/* Sidebar Items */}
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleMenuClick("admin-display")}
              className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
              Dashboard
            </button>
          </li>

          <li>
            <button
              onClick={() => handleMenuClick("admin-info")}
              className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-purple-600 dark:hover:bg-purple-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
              Edit Information
            </button>
          </li>

          {/* Products Dropdown */}
          <li>
            <button
              onClick={toggleProductsDropdown}
              className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-800 hover:text-white flex items-center justify-between"
            >
              Products
              {isProductsDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isProductsDropdownOpen && (
              <ul className="pl-4 space-y-2 mt-2">
                <li>
                  <button
                    onClick={() => handleMenuClick("upload-products")}
                    className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                  >
                    Upload Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleMenuClick("product-list")}
                    className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                  >
                    Product List
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleMenuClick("add-categories")}
                    className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-green-600 dark:hover:bg-green-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                  >
                    Add Categories
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleMenuClick("view-categories")}
                    className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-purple-600 dark:hover:bg-purple-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                  >
                    View Categories
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Orders Dropdown */}
          <li>
            <button
              onClick={toggleOrdersDropdown}
              className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-orange-600 dark:hover:bg-orange-800 hover:text-white flex items-center justify-between"
            >
              Orders
              {isOrdersDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isOrdersDropdownOpen && (
              <ul className="pl-4 space-y-2 mt-2">
                <li>
                  <button
                    onClick={() => handleMenuClick("view-orders")}
                    className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-orange-600 dark:hover:bg-orange-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                  >
                    View Orders
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleMenuClick("order-notification")}
                    className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-teal-600 dark:hover:bg-teal-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                  >
                    Order Notification
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Promotions */}
          <li>
            <button
              onClick={() => handleMenuClick("manage-promotions")}
              className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-orange-600 dark:hover:bg-orange-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
              Promotions
            </button>
          </li>

          {/* Conditionally render these sections only if user is admin */}
          {user?.isAdmin && (
            <li>
              <button
                onClick={() => handleMenuClick("manage-customers")}
                className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-pink-600 dark:hover:bg-pink-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
              >
                Manage Customers
              </button>
            </li>
          )}
          {/* <li>
            <button
              onClick={() => handleMenuClick("view-services")}
              className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-orange-600 dark:hover:bg-orange-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
              View Services
            </button>
          </li> */}
          {/* <li>
            <button
              onClick={() => handleMenuClick("upload-services")}
              className="w-full text-left px-4 py-2 bg-transparent rounded-md hover:bg-orange-600 dark:hover:bg-orange-800 hover:text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
              Upload Services
            </button>
          </li> */}
        </ul>
      </div>
    </>
  );
}
