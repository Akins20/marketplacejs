"use client";

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import useCart from "@/hooks/useCart";

const CheckoutSummary = ({ sellerId }) => {
  const { cart, getCartBySeller } = useCart();
  const [sellerCart, setSellerCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  

  useEffect(() => {
    // Check if sellerId is provided and filter cart items accordingly
    const filteredCart = getCartBySeller(sellerId);
    setSellerCart(filteredCart);

    // Calculate total price
    const total = filteredCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cart, sellerId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const removeItemFromCart = (sellerId, itemId) => {
    // Logic to remove an item from cart based on sellerId and itemId
  };

  return (
    <div className="bg-white p-6 md:mt-12 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>

      {sellerCart.length === 0 ? (
        <p>Your cart is empty for this seller.</p>
      ) : (
        <>
          <div className="space-y-4">
            {sellerCart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <p className="text-lg max-[760px]:text-sm max-[760px]:text-balance">{item.title}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-lg">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg mt-4">
            <p>Total:</p>
            <p>{formatPrice(totalPrice)}</p>
          </div>

          {/* Seller-Specific Details */}
          <div className="mt-6 sm:text-sm text-end">
            <p>Estimated 1-4 business days</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutSummary;
