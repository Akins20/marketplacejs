"use client";

import CartPage from "@/components/Cart/Cart";
import useProvideAuth from "@/components/generalUtils/useAuth";

const Cart = ({ params }) => {
  const { uniqueId } = params; // Unique ID from the URL

  // const { user } = useProvideAuth();
  return (
    <main className="min-h-screen bg-white">
      <CartPage sellerId={uniqueId} />
    </main>
  );
};

export default Cart;
