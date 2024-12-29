"use client";

import React, { useState, useRef, useEffect } from "react";
import useProvideAuth from "../generalUtils/useAuth";
import useCart from "@/hooks/useCart";
import SearchBox from "./SearchBox";
import Link from "next/link";
import { FaBook, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

// Simple icon components using SVG
const Icons = {
  ShoppingBag: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-9-1a2 2 0 1 1 4 0v1h-4V6zm9 14H5V9h14v11z" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
    </svg>
  ),
  ArrowDown: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0-8a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm9 17v-2a7 7 0 0 0-7-7H10a7 7 0 0 0-7 7v2h2v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2z" />
    </svg>
  ),
  Cart: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M17 18a2 2 0 1 1-2 2 2 2 0 0 1 2-2zM7 18a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm0-3h12a1 1 0 0 0 .962-.725l2-7A1 1 0 0 0 21 6H6.693L6.2 4.5A1 1 0 0 0 5.236 4H3a1 1 0 0 0 0 2h1.438l2.475 8.662A3 3 0 0 0 7 18h12a1 1 0 0 0 0-2H7a1 1 0 0 1-.962-.725L5.82 14z" />
    </svg>
  ),
};

const MobileNavbar = () => {
  const { user, admin } = useProvideAuth();
  const { cart } = useCart();
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);

  // Mock data - replace with your actual data/hooks
  const cartCount = Object.values(cart).reduce(
    (total, sellerItems) =>
      total +
      sellerItems.reduce(
        (sellerTotal, item) => sellerTotal + (item.quantity || 0),
        0
      ),
    0
  );

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    // Implement your sign out logic here
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: "/about", icon: Icons.ShoppingBag, label: "About" },
    { href: "/cart", icon: Icons.Cart, label: "Cart", count: cartCount },
  ];

  return (
    <nav className="flex lg:hidden flex-col overflow-visible z-30 fixed top-0 left-0 w-full bg-gradient-to-r from-gray-50 to-gray-200 text-gray-700 shadow-lg">
      <div className="flex justify-between items-center w-full px-4 py-2">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-pink-500 transition-colors hover:text-pink-600"
        >
          <Icons.ShoppingBag />
        </Link>

        {/* Search Input */}
        <div
          className={`relative flex-1 mx-4 ${isSearchBoxOpen ? "hidden" : ""}`}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-gray-50 px-4 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            onFocus={() => setIsSearchBoxOpen(true)}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
            <Icons.Search />
          </span>
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 text-xl hover:text-pink-500 transition-colors p-2"
          aria-label="Toggle menu"
        >
          <Icons.ArrowDown />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-full text-sm right-0 w-48 bg-white rounded-lg shadow-lg py-2 mt-1 mr-2 transform origin-top-right transition-all z-40"
        >
          {navLinks.map(({ href, icon: Icon, label, count }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon />
              <span className="ml-2">{label}</span>
              {count > 0 && label === "Cart" && (
                <span className="ml-auto bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          ))}

          {/* User section */}
          <div className="border-t border-gray-200 mt-2 pt-2">
            {user || admin ? (
              <>
                <Link
                  href={`/${user?.uniqueId || admin?.uniqueId}`}
                  prefetch={true}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icons.User />
                  <span className="ml-2">Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaSignOutAlt />
                  <span className="ml-2">Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                prefetch={true}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaSignInAlt />
                <span className="ml-2">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Mobile Search */}
      {isSearchBoxOpen && (
        <div className="fixed top-12 left-0 w-full bg-white shadow-lg z-50">
          <div className="flex items-start px-4 pt-2">
            <button
              onClick={() => setIsSearchBoxOpen(false)}
              className="text-gray-700 mr-4 mt-2 hover:text-pink-500 transition-colors"
              aria-label="Close search"
            >
              <Icons.ArrowLeft />
            </button>
            <SearchBox />
            {/* <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-gray-100 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              autoFocus
            /> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;
