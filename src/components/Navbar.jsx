"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaHome,
  FaShoppingBag,
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaLockOpen,
  FaTimes,
  FaBars,
  FaArrowLeft,
} from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import useProvideAuth from "./generalUtils/useAuth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import SearchBox from "./SearchBox";
import useCart from "@/hooks/useCart";

export default function Navbar() {
  const { user, admin } = useProvideAuth();
  const { cart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);

  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Toggle Search Box
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Calculate total cart count
  const cartCount = Object.values(cart).reduce((total, sellerItems) => {
    return (
      total +
      sellerItems.reduce(
        (sellerTotal, item) => sellerTotal + (item.quantity || 0),
        0
      )
    );
  }, 0);

  return (
    <div className="relative">
      {/* Desktop Navbar (Vertical Instagram-style) */}
      <nav className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-20 items-center bg-gradient-to-r from-gray-50 to-gray-200 text-gray-700 shadow-lg">
        <div className="flex flex-col items-center py-4 space-y-8">
          <Link href="/" className="text-4xl font-bold text-black mb-4">
            <FaShoppingBag className="text-3xl text-pink-500" />
          </Link>
          <Link href="/" className="text-xl mb-4 hover:text-pink-500">
            <FaHome />
          </Link>
          <button
            onClick={toggleSearch}
            className="text-xl mb-4 hover:text-pink-500"
          >
            <FaSearch />
          </button>
          <Link href="/shop" className="text-xl mb-4 hover:text-pink-500">
            <FaShoppingBag />
          </Link>
          {user || admin ? (
            <Link
              href={`/${user?.uniqueId || admin?.uniqueId}`}
              className="text-xl mb-4 hover:text-pink-500"
            >
              <FaUser />
            </Link>
          ) : (
            <Link href="/sign-in" className="text-xl mb-4 hover:text-pink-500">
              <FaLockOpen />
            </Link>
          )}
          <Link href="/cart" className="text-xl mb-4 hover:text-pink-500">
            <div className="relative">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
          {user || admin ? (
            <button
              onClick={() => handleSignOut()}
              className="text-xl mb-4 hover:text-red-500"
            >
              <FaSignOutAlt />
            </button>
          ) : null}
        </div>
      </nav>

      {/* Mobile Navbar (Horizontal Style at the Top) */}
      <nav className="flex lg:hidden overflow-hidden z-30 fixed top-0 left-0 w-full bg-gradient-to-r from-gray-50 to-gray-200 text-gray-700 shadow-lg">
        <div className="flex justify-between items-center w-full px-4 py-2">
          {/* Brand Logo */}
          <Link href="/" className="text-2xl font-bold text-pink-500">
            <FaShoppingBag />
          </Link>

          {/* Search Input */}
          <div
            className={`relative flex items-center ${
              isSearchBoxOpen ? "hidden" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Search..."
              hidden={isSearchBoxOpen}
              className="bg-gray-100 px-4 py-1 rounded-lg text-sm focus:outline-none"
              onFocus={() => setIsSearchBoxOpen(true)}
            />
            <FaSearch className="absolute right-2 text-gray-500" />
          </div>
          {/* Dropdown Menu Icon */}
          <button
            onClick={toggleDropdown}
            className="text-md hover:text-pink-500 relative"
          >
            {isDropdownOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-4 right-4 bg-green-500 shadow-md rounded-md p-4 z-40"
          >
            <div className="flex flex-col space-y-4">
              {user || admin ? (
                <>
                  <Link
                    href={`/${user?.uniqueId || admin?.uniqueId}`}
                    className="text-sm text-gray-700 hover:text-pink-500"
                  >
                    <FaUser className="inline mr-2" /> Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-700 hover:text-red-500"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/sign-in"
                  className="text-sm text-gray-700 hover:text-pink-500"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/cart"
                className="text-sm text-gray-700 hover:text-pink-500 relative"
              >
                <FaShoppingCart className="inline mr-2" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile SearchBox Component */}
      {isSearchBoxOpen && (
        <div className="fixed top-12 left-0 w-full bg-white shadow-lg z-20">
          <div className="flex items-center px-4">
            <button
              onClick={() => setIsSearchBoxOpen(false)}
              className="text-gray-700 mr-4"
            >
              <FaArrowLeft />
            </button>
            <SearchBox />
          </div>
        </div>
      )}

      {/* Search Box Slide-in (Common for both desktop and mobile) */}
      <div
        className={`z-30 fixed top-0 left-20 h-screen bg-gradient-to-r from-gray-200 to-gray-50 transition-transform duration-300 ease-in-out ${
          isSearchOpen ? "w-96" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-4">
          <SearchBox />
        </div>
      </div>
    </div>
  );
}
