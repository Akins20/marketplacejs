"use client";
import { useState, useEffect } from "react";
import CustomerInfo from "./CustomerInfo";
import DeliveryInfo from "./DeliveryInfo";
// import CartSummary from "../Cart/CartSummary";
import useCart from "@/hooks/useCart";
import { CheckoutProvider } from "../generalUtils/checkoutContext";
import PaystackButton from "./PaystackButton";
// import FlutterwavePaymentButton from "./FlutterwavePaymentButton";
import useProvideAuth from "../generalUtils/useAuth";
import CheckoutSummary from "./CheckoutSummary";
import { getUserProfileByUniqueId } from "@/utils/usersUtils";

const CheckoutPage = ({ sellerId }) => {
  const {
    cart,
    getCartBySeller,
    getTotalCartPriceBySeller,
    getTotalCartQuantityBySeller,
  } = useCart();
  const { user } = useProvideAuth();
  const [userCart, setUserCart] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [totalCartQuantity, setTotalCartQuantity] = useState(0);
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchCart = () => {
      const cartData = getCartBySeller(sellerId);
      // console.log("Cart Data: ", cartData);
      setUserCart(cartData);

      const cartPrice = getTotalCartPriceBySeller(sellerId, cart);
      const cartQuantity = getTotalCartQuantityBySeller(sellerId, cart);
      // console.log("CartPrice: ", cartPrice);
      // console.log("CartQuantity: ", cartQuantity);

      setTotalCartPrice(cartPrice);
      setTotalCartQuantity(cartQuantity);
    };
    const fetchSellerData = async () => {
      const sellerInfo = await getUserProfileByUniqueId(sellerId);
      // console.log("This is sellerData", JSON.stringify(sellerInfo));
      setSellerData(sellerInfo.bank_details);
    };
    fetchSellerData();
    fetchCart();
    setLoading(false);
  }, [sellerId, cart]);

  return (
    <CheckoutProvider>
      <div className="mx-auto md:mx-20 py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-[760px]:pt-14">
        <div className="text-gray-800">
          <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
          <CustomerInfo />
          <DeliveryInfo />
        </div>
        <div className="text-gray-800">
          <CheckoutSummary sellerId={sellerId} />
          {!loading ? (
            <PaystackButton
              cart={cart}
              totalCartPrice={totalCartPrice}
              totalCartQuantity={totalCartQuantity}
              userEmail={user?.email}
              sellerData={sellerData}
              sellerId={sellerId}
            />
          ) : (
            <p>Calculating...</p>
          )}
        </div>
      </div>
    </CheckoutProvider>
  );
};

export default CheckoutPage;
