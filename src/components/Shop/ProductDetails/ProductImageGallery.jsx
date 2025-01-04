"use client";

import { useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductImageGallery = ({ imageUrls }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % imageUrls.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto md:ml-4">
      {/* Main Image */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src={imageUrls[currentImage]}
          alt={`Product Image ${currentImage + 1}`}
          fill
          className="object-cover"
          priority
        />

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
        >
          <FaChevronLeft className="text-gray-700" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
        >
          <FaChevronRight className="text-gray-700" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="mt-4 flex justify-center space-x-2 overflow-x-auto overflow-y-hidden">
        {imageUrls.map((imageUrl, index) => (
          <div
            key={index}
            className={`w-16 h-16 md:w-20 md:h-20 cursor-pointer border-2 overflow-y-hidden transition-all ${
              index === currentImage
                ? "border-green-500 scale-105"
                : "border-gray-200 hover:border-gray-400"
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <Image
              src={imageUrl}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
