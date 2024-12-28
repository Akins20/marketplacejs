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
  const [loading, setLoading] = useState(true);
  const [filteredCart, setFilteredCart] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState("all");

  useEffect(() => {
    setLoading(true);
    if (sellerId) {
      const sellerCart = getCartBySeller(sellerId);
      setFilteredCart(sellerCart);
      setSelectedSellerId(sellerId);
    } else {
      setFilteredCart(Object.values(cart).flat());
    }
    setLoading(false);
  }, [cart, sellerId]);

  const handleCheckout = () => {
    if (filteredCart.length === 0) return;
    const pickedSellerId =
      selectedSellerId === "all"
        ? Object.keys(cart)[0]
        : selectedSellerId || sellerId;
    router.push(`/${pickedSellerId}/checkout`);
  };

  return (
    <div className="mx-auto py-10 px-6 md:mx-20 sm:mx-10 bg-white max-[760px]:pt-14">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Your Cart
      </h1>

      {loading ? (
        <div className="text-center">
          <p className="text-lg">Loading your cart...</p>
        </div>
      ) : filteredCart.length === 0 ? (
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
          {!sellerId && (
            <SellerFilter
              selectedSellerId={selectedSellerId}
              setSelectedSellerId={setSelectedSellerId}
              cart={cart}
            />
          )}

          <div className="flex flex-col md:flex-row md:space-x-8 text-gray-800">
            <div className="flex-grow space-y-6">
              {filteredCart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <CartSummary
              filteredCart={filteredCart}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
