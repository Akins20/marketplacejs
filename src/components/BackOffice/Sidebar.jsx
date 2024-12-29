"use client";

import { useState, useEffect, useRef } from "react";

const Icons = {
  ChevronDown: () => (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  ChevronUp: () => (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Bars: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm0 7a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm0 7a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L12 10.586l6.293-6.293a1 1 0 111.414 1.414L13.414 12l6.293 6.293a1 1 0 01-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 01-1.414-1.414L10.586 12 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export default function Sidebar({ setSelectedSection, user }) {
  const [isProductsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [isOrdersDropdownOpen, setOrdersDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen]);

  const handleMenuClick = (section) => {
    setSelectedSection(section);
    setMobileSidebarOpen(false);
  };

  const MenuButton = ({ onClick, children, hoverColor = "blue" }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300
        hover:bg-${hoverColor}-600 hover:text-white
        active:bg-${hoverColor}-700
        focus:outline-none focus:ring-2 focus:ring-${hoverColor}-500 focus:ring-opacity-50`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-[760px]:pt-10 min-[800px]:ml-6">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 z-40 p-4 -left-4 max-[760px]:mt-10">
        <button
          onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <Icons.Close /> : <Icons.Bars />}
        </button>
      </div>

      {/* Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:relative top-0 left-0 h-full w-72 lg:w-64 bg-white lg:bg-gradient-to-r from-gray-200 to-gray-50 
          transform transition-transform duration-300 ease-in-out z-50
          ${
            isMobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          overflow-y-auto shadow-lg lg:shadow-none`}
      >
        <div className="p-6 space-y-6">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Icons.Close />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="space-y-4">
            <li>
              <MenuButton onClick={() => handleMenuClick("admin-display")}>
                Dashboard
              </MenuButton>
            </li>

            <li>
              <MenuButton
                onClick={() => handleMenuClick("admin-info")}
                hoverColor="purple"
              >
                Edit Information
              </MenuButton>
            </li>

            {/* Products Dropdown */}
            <li className="space-y-2">
              <button
                onClick={() => setProductsDropdownOpen(!isProductsDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-md hover:bg-yellow-600 hover:text-white transition-colors"
              >
                <span>Products</span>
                {isProductsDropdownOpen ? (
                  <Icons.ChevronUp />
                ) : (
                  <Icons.ChevronDown />
                )}
              </button>

              {isProductsDropdownOpen && (
                <ul className="pl-4 space-y-2 mt-2">
                  <li>
                    <MenuButton
                      onClick={() => handleMenuClick("upload-products")}
                    >
                      Upload Products
                    </MenuButton>
                  </li>
                  <li>
                    <MenuButton
                      onClick={() => handleMenuClick("product-list")}
                      hoverColor="yellow"
                    >
                      Product List
                    </MenuButton>
                  </li>
                  <li>
                    <MenuButton
                      onClick={() => handleMenuClick("add-categories")}
                      hoverColor="green"
                    >
                      Add Categories
                    </MenuButton>
                  </li>
                  <li>
                    <MenuButton
                      onClick={() => handleMenuClick("view-categories")}
                      hoverColor="purple"
                    >
                      View Categories
                    </MenuButton>
                  </li>
                </ul>
              )}
            </li>

            {/* Orders Dropdown */}
            <li className="space-y-2">
              <button
                onClick={() => setOrdersDropdownOpen(!isOrdersDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-md hover:bg-orange-600 hover:text-white transition-colors"
              >
                <span>Orders</span>
                {isOrdersDropdownOpen ? (
                  <Icons.ChevronUp />
                ) : (
                  <Icons.ChevronDown />
                )}
              </button>

              {isOrdersDropdownOpen && (
                <ul className="pl-4 space-y-2 mt-2">
                  <li>
                    <MenuButton
                      onClick={() => handleMenuClick("view-orders")}
                      hoverColor="orange"
                    >
                      View Orders
                    </MenuButton>
                  </li>
                  {/* <li>
                    <MenuButton
                      onClick={() => handleMenuClick("order-notification")}
                      hoverColor="teal"
                    >
                      Order Notification
                    </MenuButton>
                  </li> */}
                </ul>
              )}
            </li>

            <li>
              <MenuButton
                onClick={() => handleMenuClick("manage-promotions")}
                hoverColor="orange"
              >
                Promotions
              </MenuButton>
            </li>

            {user?.isAdmin && (
              <li>
                <MenuButton
                  onClick={() => handleMenuClick("manage-customers")}
                  hoverColor="pink"
                >
                  Manage Customers
                </MenuButton>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
