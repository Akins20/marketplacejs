"use client";

import { useState } from "react";
import useCart from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";

const CartItem = ({ item, sellerId, updateCartQuantity, removeCartItem }) => {
  const [quantity, setQuantity] = useState(item.newQuantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeCartItem(sellerId, item.id);
    } else if (newQuantity <= item.quantity) {
      setQuantity(newQuantity);
      updateCartQuantity(sellerId, item.id, newQuantity, item.quantity);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);

  const formatTitle = (title) => title.trim().replace(/\s+/g, "-");
  const formattedTitle = formatTitle(item.title);

  return (
    <div className="flex flex-col sm:flex-row items-center p-4 border rounded-lg shadow-lg bg-white transition-transform hover:scale-105">
      <Link
        href={`/${sellerId || item.sellerId}/shop/${formattedTitle}`}
        prefetch={true}
        className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24"
      >
        <Image
          src={item.imageUrl || item.imageUrls[0]}
          alt={item.title}
          layout="fill"
          className="object-cover rounded-md"
        />
      </Link>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex-grow w-full">
        <h2 className="text-base sm:text-sm font-semibold">{item.title}</h2>
        <p className="text-base sm:text-sm font-light">{item.size || ""}</p>
        <p className="text-base sm:text-sm font-light">{item.color || ""}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
          <div className="flex items-center justify-start space-x-3 sm:space-x-3">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-sm sm:text-lg px-2 sm:px-3 py-1 rounded-md"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              -
            </button>
            <span className="text-sm sm:text-lg">{quantity}</span>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-sm sm:text-lg px-2 sm:px-3 py-1 rounded-md"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </button>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center justify-between space-x-4 sm:space-x-4">
            <p className="text-sm sm:text-base font-bold text-gray-800">
              {formatPrice(item.price * quantity)}
            </p>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() =>
                removeCartItem(sellerId, item.id, item.size, item.color)
              }
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
