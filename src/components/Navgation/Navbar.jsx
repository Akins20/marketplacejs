"use client";

import { useState } from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import SearchBox from "./SearchBox";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="relative">
      <DesktopNavbar toggleSearch={toggleSearch} />
      <MobileNavbar />

      {/* Shared Search Box Slide-in */}
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
