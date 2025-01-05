import React, { useState, useEffect } from "react";
import { useCheckout } from "../generalUtils/checkoutContext";
import PaymentFailedModal from "./PaymentFailedModal";
import PaymentSuccessModal from "./PaymentSuccessModal";
import useCart from "@/hooks/useCart"; // Hook to manage the cart
import { applyDiscountOnCheckout } from "@/utils/PromotionUtils"; // Utility to apply discount
import { useRouter } from "next/navigation";
// import { calculateAdditionalCharge } from "@/utils/calculateAdditionCharge";

const PaystackButton = ({
  cart,
  totalCartPrice,
  totalCartQuantity,
  userEmail,
  sellerData,
  sellerId,
}) => {
  const { customerInfo, deliveryInfo } = useCheckout();
  const { clearCart } = useCart(); // Clear the cart after a successful transaction
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [orderData, setOrderData] = useState(null); // Hold order data for success modal
  const [discountedCart, setDiscountedCart] = useState([]); // Store discounted cart
  const [totalAmount, setTotalAmount] = useState(0); // Store the total amount after discount and additional charges
  const [totalDiscount, setTotalDiscount] = useState(0); // Store total discount
  const [splitCode, setSplitCode] = useState("");
  const [subAccountCode, setSubAccountCode] = useState("");
  const router = useRouter();
  // console.log("Usermail: ", userEmail)

  const applyDiscount = (item) => {
    const {
      discountType,
      discountAmount,
      discountPercentage,
      maxDiscountedItems,
    } = item.promotion || {};

    let discountedPrice = item.price;
    let discountedItems = Math.min(
      item.newQuantity,
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
    const sellerBankData = sellerData?.transactionSplit;
    const split_code = sellerBankData?.split_code;
    const subaccount = sellerBankData?.subaccounts?.find(
      (sub) => sub.subaccount.subaccount_code
    ).subaccount;
    const subaccount_code = subaccount?.subaccount_code;

    setSplitCode(split_code);
    setSubAccountCode(subaccount_code);
    // console.log("Split Code: ", split_code);
    // console.log("Sub Account Code: ", subaccount_code);

    const calculateDiscountedTotal = async () => {
      try {
        // Fetch the discounted cart and totals
        const { updatedCart, total, totalDiscount } =
          userEmail && cart && sellerId
            ? await applyDiscountOnCheckout(userEmail, cart, sellerId)
            : 0;

        // Calculate final totalAmount (including additional charges)
        const finalTotal = updatedCart.reduce((total, item) => {
          const { discountedPrice, discountedItems } = applyDiscount(item);
          const totalItemPrice =
            discountedItems * discountedPrice +
            (item.newQuantity - discountedItems) * item.price;
          // const additionalCharge = calculateAdditionalCharge(totalItemPrice);
          return total + totalItemPrice;
        }, 0);

        // Update states with calculated values
        setDiscountedCart(updatedCart); // Store the discounted cart
        setTotalDiscount(totalDiscount || 0); // Store total discount

        setTotalAmount(finalTotal * 100); // Convert to kobo for Paystack
      } catch (error) {
        console.error("Error applying discount:", error);

        // Fallback to original cart if an error occurs
        setTotalAmount(totalCartPrice * 100); // Convert to kobo for Paystack
      }
    };

    if (userEmail && userEmail !== undefined && userEmail !== null) {
      calculateDiscountedTotal();
    } else {
      setTotalAmount(totalCartPrice * 100); // Convert to kobo for Paystack
    }
  }, [cart, sellerData?.transactionSplit, sellerId, totalCartPrice, userEmail]);

  const handlePayment = async () => {
    // Validate customer and delivery info
    if (!customerInfo.email || totalAmount <= 0 || !deliveryInfo.address) {
      alert("Please complete all the necessary information.");
      return;
    }

    try {
      setLoading(true);
      const paymentHandler = window.PaystackPop.setup({
        key:
          process.env.PAYSTACK_PUBLIC_KEY ||
          "your test or live secret key",
        email: customerInfo.email,
        amount: totalAmount, // Submit the discounted total (including additional charges) to Paystack
        currency: "NGN",
        ref: generateReference(), // Unique transaction reference
        // split_code: splitCode,
        subaccount: subAccountCode,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: customerInfo.name,
            },
            {
              display_name: "Delivery Address",
              variable_name: "delivery_address",
              value: `${deliveryInfo.address}, ${deliveryInfo.city}`,
            },
          ],
        },
        callback: async (response) => {
          // Payment successful, set order data and show success modal
          const orderDetails = {
            customerInfo,
            deliveryInfo,
            cart: discountedCart, // Pass the discounted cart with additional charges
            transactionReference: response.reference,
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
        },
        onClose: () => {
          setPaymentFailed(true);
        },
      });

      paymentHandler.openIframe();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const generateReference = () => {
    return `txn_${new Date().getTime()}`;
  };

  const handleSuccessClose = () => {
    setPaymentSuccess(false);
    clearCart(); // Clear the cart when the success modal closes
    router.push("/"); // Redirect to the orders page after successful payment
  };

  return (
    <>
      <button
        onClick={handlePayment}
        className={`mt-6 px-4 py-2 text-white rounded-md transition duration-300 ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : `Pay ${totalAmount / 100} NGN`}
      </button>

      {paymentSuccess && (
        <PaymentSuccessModal order={orderData} onClose={handleSuccessClose} />
      )}
      {paymentFailed && (
        <PaymentFailedModal onClose={() => setPaymentFailed(false)} />
      )}
    </>
  );
};

export default PaystackButton;
