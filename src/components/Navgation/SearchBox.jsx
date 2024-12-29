"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useProductData } from "@/hooks/useProductData";
import Image from "next/image";
import Link from "next/link";

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { products, loading, error } = useProductData(); // Fetch products using the hook

  // Update filtered products as the user types
  useEffect(() => {
    if (searchTerm) {
      const filtered = products
        .filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 10); // Limit results to 10
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  // Format the product title for URL
  const formatTitle = (title) => title.trim().replace(/\s+/g, "-");

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative text-black">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="p-3 pl-10 rounded-lg bg-white border border-gray-300 w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
      </div>

      {/* Display Results in a Block */}
      <div className="mt-4">
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product, index) => (
              <Link
                href={`${product.sellerId}/shop/${formatTitle(product.title)}`}
                key={index}
                onClick={() => setSearchTerm("")}
                prefetch={true}
                target={`_blank`}
                className="flex items-center bg-gray-50 rounded-lg shadow hover:bg-gray-100 transition"
              >
                <div className="relative w-24 h-16">
                  <Image
                    src={product.imageUrls[0]}
                    alt={product.title}
                    layout="fill"
                    // width={40}
                    // height={40}
                    className="rounded-l-md"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-bold text-gray-700">{product.title}</p>
                  <p className="text-gray-500">₦{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
