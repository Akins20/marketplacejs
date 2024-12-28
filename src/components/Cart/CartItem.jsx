import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import useCart from "@/hooks/useCart";

const CartItem = ({ item }) => {
  const { updateCartItem, removeCartItem } = useCart();
  const [quantity, setQuantity] = useState(item.quantity); // Local state for real-time updates

  // Update the cart when the quantity changes
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeCartItem(item.sellerId, item.id); // Remove item if quantity <= 0
    } else {
      setQuantity(newQuantity); // Update local state
      updateCartItem(item.sellerId, { ...item, quantity: newQuantity }); // Update in the global cart state
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);

  return (
    <div className="flex flex-col sm:flex-row items-center p-4 border rounded-lg shadow-lg bg-white transition-transform hover:scale-105">
      {/* Image Section */}
      <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
        <Image
          src={item.imageUrls[0]}
          alt={item.title}
          layout="fill"
          className="object-cover rounded-md"
        />
      </div>
      {/* Details Section */}
      <div className="mt-4 sm:mt-0 sm:ml-4 flex-grow w-full">
        <h2 className="text-base sm:text-lg font-semibold">{item.title}</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Brand: {item.brand}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-3">
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
          {/* Price and Remove Button */}
          <div className="mt-2 sm:mt-0 flex items-center justify-between space-x-4 sm:space-x-4">
            <p className="text-sm sm:text-base font-bold text-gray-800">
              {formatPrice(item.price * quantity)}
            </p>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => removeCartItem(item.sellerId, item.id)}
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
