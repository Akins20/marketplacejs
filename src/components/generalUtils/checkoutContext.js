"use client";
import React, { createContext, useContext, useState } from "react";

// Create Checkout context
const CheckoutContext = createContext();

// Checkout Provider to wrap the component tree
export const CheckoutProvider = ({ children }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria", // Default country, can be dynamic
  });

  // A general handler to update customer or delivery info
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <CheckoutContext.Provider
      value={{
        customerInfo,
        setCustomerInfo,
        deliveryInfo,
        setDeliveryInfo,
        handleCustomerInfoChange,
        handleDeliveryInfoChange,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

// Hook to use the checkout context
export const useCheckout = () => {
  return useContext(CheckoutContext);
};
