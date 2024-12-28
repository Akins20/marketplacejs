"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // Next.js Link component for routing
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Icons for prev and next buttons

export default function ProductCategories({ categories }) {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Move to the previous slide
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Move to the next slide
  const handleNext = () => {
    if (currentIndex < categories.length - 6) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Function to adjust title display logic
  const formatTitle = (title) => {
    if (title.length > 10) {
      const words = title.split(" ");
      if (words.length >= 2) {
        return words[0]; // Return the first word only if title contains more than one word
      }
    }
    return title; // Return the full title if it's short enough
  };

  //   if (loading) {
  //     return <p>Loading categories...</p>; // Loading state
  //   }

  return (
    <div className="w-auto flex justify-center items-center p-6">
      {/* Centered container */}
      <div className="relative w-[80%] mx-auto md:mx-20">
        <h2 className="text-3xl font-semibold mb-4 text-start">
          Popular Categories
        </h2>

        <div className="relative">
          {/* Slider */}
          <div className="flex overflow-hidden justify-center">
            {/* Categories displayed in slider */}
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 16.67}%)` }} // Shift the visible categories
            >
              {categories.map((category) => (
                <div key={category.id} className="w-40 p-2 mx-2">
                  <Link
                    href={`/shop`}
                    passHref
                    prefetch={false}
                    className="block bg-white text-black rounded-lg shadow-md overflow-hidden group"
                  >
                    {/* Fixed Category Image */}
                    <div className="relative h-36 w-full">
                      <Image
                        src={category.imageUrl}
                        alt={category.title}
                        layout="fill"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    {/* Category Title */}
                    <span className="block text-center text-sm p-2 font-medium group-hover:text-green-600 truncate">
                      {formatTitle(category.title)}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Prev Button */}
          {currentIndex > 0 && (
            <button
              className="absolute top-1/2 left-0 p-2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full"
              onClick={handlePrev}
            >
              <FiChevronLeft className="text-xl" />
            </button>
          )}

          {/* Next Button */}
          {currentIndex < categories.length - 6 && (
            <button
              className="absolute top-1/2 right-0 p-2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full"
              onClick={handleNext}
            >
              <FiChevronRight className="text-xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
