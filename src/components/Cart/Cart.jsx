"use client";

import { useState, useEffect } from "react";
import useCart from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import SellerFilter from "./SellerFilter";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

const CartPage = ({ sellerId }) => {
  const { cart, getCartBySeller } = useCart();
  const router = useRouter();
  const [filteredCart, setFilteredCart] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState("all");

  // Function to check if an object or array is empty
  const isEmpty = (obj) => {
    return (
      obj == null ||
      (Array.isArray(obj) && obj.length === 0) ||
      (typeof obj === "object" && Object.keys(obj).length === 0)
    );
  };

  // Update filteredCart whenever cart or sellerId changes
  useEffect(() => {
    if (sellerId) {
      const sellerCart = getCartBySeller(sellerId) || [];
      setFilteredCart(Array.isArray(sellerCart) ? sellerCart : []);
      setSelectedSellerId(sellerId);
    } else {
      const allCartItems = Object.values(cart || {}).flat() || [];
      setFilteredCart(Array.isArray(allCartItems) ? allCartItems : []);
      setSelectedSellerId("all");
    }
  }, [cart, sellerId]); // Re-run whenever cart or sellerId changes

  // Handle Checkout
  const handleCheckout = () => {
    if (isEmpty(filteredCart)) return;

    const pickedSellerId =
      selectedSellerId === "all"
        ? Object.keys(cart)[0] // Default to the first seller if no seller is selected
        : selectedSellerId;

    router.push(`/${pickedSellerId}/checkout`);
  };

  return (
    <div className="mx-auto py-10 px-6 md:mx-20 sm:mx-10 bg-white max-[760px]:pt-14">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Your Cart
      </h1>

      {/* If cart is empty, show appropriate message */}
      {isEmpty(filteredCart) ? (
        <div className="text-center">
          <p className="text-xl font-semibold">
            {sellerId
              ? "No items found for this seller."
              : "Your cart is empty."}
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div>
          {/* Only show Seller Filter if no sellerId is passed */}
          {!sellerId && (
            <SellerFilter
              selectedSellerId={selectedSellerId}
              setSelectedSellerId={setSelectedSellerId}
              cart={cart}
            />
          )}

          <div className="flex flex-col md:flex-row md:space-x-8 text-gray-800">
            <div className="flex-grow space-y-6">
              {/* Ensure filteredCart is an array and map over it */}
              {Array.isArray(filteredCart) &&
                filteredCart.map((item) => (
                  <CartItem key={item.id} item={item} sellerId={sellerId} />
                ))}
            </div>
            <CartSummary
              sellerId={sellerId}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
