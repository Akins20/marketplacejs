import React, { useState, useEffect } from "react";
import { useCheckout } from "../generalUtils/checkoutContext";
import PaymentFailedModal from "./PaymentFailedModal";
import PaymentSuccessModal from "./PaymentSuccessModal";
import useCart from "@/hooks/useCart"; // Hook to manage the cart
import { applyDiscountOnCheckout } from "@/utils/PromotionUtils"; // Utility to apply discount
import { calculateAdditionalCharge } from "@/utils/calculateAdditionCharge";
import { closePaymentModal, FlutterWaveButton } from "flutterwave-react-v3"; // Import Flutterwave's
import Logo from "@/assets/doodies.jpeg";

const FlutterwavePaymentButton = ({ cart, userEmail }) => {
  const { customerInfo, deliveryInfo } = useCheckout();
  const { clearCart } = useCart(); // Clear the cart after a successful transaction
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [orderData, setOrderData] = useState(null); // Hold order data for success modal
  const [discountedCart, setDiscountedCart] = useState([]); // Store discounted cart
  const [totalAmount, setTotalAmount] = useState(0); // Store the total amount after discount and additional charges
  const [totalDiscount, setTotalDiscount] = useState(0); // Store total discount
  const [totalAdditionalCharge, setTotalAdditionalCharge] = useState(0); // Store additional charges

  const applyDiscount = (item) => {
    const {
      discountType,
      discountAmount,
      discountPercentage,
      maxDiscountedItems,
    } = item.promotion || {};

    let discountedPrice = item.price;
    let discountedItems = Math.min(
      item.quantity,
      parseInt(maxDiscountedItems, 10) || 0
    );

    if (discountType === "percentage" && discountPercentage > 0) {
      discountedPrice =
        item.price - (item.price * parseFloat(discountPercentage)) / 100;
    } else if (discountType === "amount" && discountAmount > 0) {
      discountedPrice = item.price - discountAmount;
    }

    return {
      discountedPrice: Math.max(0, discountedPrice), // Ensure price doesn't go below 0
      discountedItems, // Limited to max discounted items
    };
  };

  // Apply discounts and calculate the final amount
  useEffect(() => {
    const calculateDiscountedTotal = async () => {
      try {
        // Fetch the discounted cart and totals
        const { updatedCart, total, totalDiscount } =
          await applyDiscountOnCheckout(userEmail, cart);

        // Calculate additional charges
        const additionalCharges = updatedCart.reduce((acc, item) => {
          const discountedPrice = item.discountedPrice || item.price;
          const itemTotal = discountedPrice * item.quantity;
          return acc + calculateAdditionalCharge(itemTotal); // Apply charge based on total price per item
        }, 0);

        // Calculate final totalAmount (including additional charges)
        const finalTotal = updatedCart.reduce((total, item) => {
          const { discountedPrice, discountedItems } = applyDiscount(item);
          const totalItemPrice =
            discountedItems * discountedPrice +
            (item.quantity - discountedItems) * item.price;
          const additionalCharge = calculateAdditionalCharge(totalItemPrice);
          return total + totalItemPrice + additionalCharge;
        }, 0);

        // Update states with calculated values
        setDiscountedCart(updatedCart); // Store the discounted cart
        setTotalAdditionalCharge(additionalCharges); // Store additional charges
        setTotalDiscount(totalDiscount || 0); // Store total discount

        setTotalAmount(finalTotal * 100); // Convert to kobo for Flutterwave
      } catch (error) {
        console.error("Error applying discount:", error);

        // Fallback to original cart if an error occurs
        const totalCart = cart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        const additionalCharges = cart.reduce(
          (acc, item) =>
            acc + calculateAdditionalCharge(item.price * item.quantity),
          0
        );
        setTotalAdditionalCharge(additionalCharges);
        setTotalAmount((totalCart + additionalCharges) * 100); // Convert to kobo for Flutterwave
      }
    };

    calculateDiscountedTotal();
  }, [cart, userEmail]);

  // Handle Flutterwave's callback for successful transactions
  const handleFlutterwaveSuccess = async (response) => {
    const orderDetails = {
      customerInfo,
      deliveryInfo,
      cart: discountedCart, // Pass the discounted cart with additional charges
      transactionReference: response.transaction_id,
      totalAmount: totalAmount,
      paymentResponse: response,
    };

    setOrderData(orderDetails); // Store order data for success modal
    setPaymentSuccess(true);

    try {
      // Send order details to the backend API for notification and saving
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      if (!res.ok) {
        throw new Error("Failed to save the order.");
      }
    } catch (error) {
      console.error("Backend error:", error);
      setPaymentFailed(true);
    }
  };

  // Flutterwave payment configuration
  const config = {
    public_key:
      process.env.FLUTTERWAVE_PUBLIC_KEY ||
      "FLWPUBK-194a7421b1e1e7e0acc977ced9ab5667-X",
    tx_ref: `txn_${new Date().getTime()}`,
    amount: totalAmount / 100, // Amount in NGN (convert kobo to Naira)
    currency: "NGN",
    payment_options: "card, banktransfer, ussd",
    customer: {
      email: customerInfo.email,
      phonenumber: customerInfo.phoneNumber,
      name: customerInfo.name,
    },
    customizations: {
      title: "Doodies",
      description: "Payment for items in cart",
      logo: Logo, // Add your logo here
    },
    callback: (response) => {
      if (response.status === "successful") {
        handleFlutterwaveSuccess(response);
      } else {
        setPaymentFailed(true);
      }
      closePaymentModal(); // Close the Flutterwave modal programmatically
    },
    onclose: () => {
      setPaymentFailed(true);
    },
  };

  const handleSuccessClose = () => {
    setPaymentSuccess(false);
    clearCart(); // Clear the cart when the success modal closes
  };

  return (
    <>
      <FlutterWaveButton
        {...config}
        text={`Pay ${totalAmount / 100} NGN`} // Display the amount to be paid
        className={`mt-6 px-4 py-2 text-white rounded-md transition duration-300 ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      />

      {paymentSuccess && (
        <PaymentSuccessModal order={orderData} onClose={handleSuccessClose} />
      )}
      {paymentFailed && (
        <PaymentFailedModal onClose={() => setPaymentFailed(false)} />
      )}
    </>
  );
};

export default FlutterwavePaymentButton;
