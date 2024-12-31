"use client";

import React, { useState, useEffect } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { format } from "date-fns";
// import { auth, firestore } from "@/firebase";
import RoleSelector from "@/components/Auth/RoleSelector";
import BuyerDetails from "@/components/Auth/BuyerDetails";
import SellerDetails from "@/components/Auth/SellerDetails";
import NotificationModal from "@/components/NotificationModal";
import Loader from "@/components/Loader";
import useSignUp from "@/hooks/useSignup";

const SignUpForm = () => {
  const {
    role,
    setRole,
    formData,
    setFormData,
    sellerDetails,
    setSellerDetails,
    banks,
    loading,
    notification,
    handleSignUp,
  } = useSignUp();

  // const testPaystack = async () => {
  //   const response = await fetch("/api/transaction-auth", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       bankCode: "044",
  //       accountNumber: "1630209641",
  //       businessName: "Zenova",
  //     }),
  //   });
  //   console.log("THis is response:", JSON.stringify(response.json));
  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     throw new Error(errorData.message);
  //   }

  // };

  return (
    <div className="flex items-center overflow-x-hidden justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-300 py-14">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
        <p className="text-center text-gray-500 mb-6">
          Create an account to start shopping or selling products!
        </p>
        <RoleSelector role={role} setRole={setRole} />
        {role && (
          <form onSubmit={handleSignUp}>
            <div
              className={`grid grid-cols-1 gap-6 transition-transform duration-700 ${
                role === "seller" ? "grid-cols-2 max-[760px]:grid-cols-1" : ""
              }`}
            >
              {/* Common Details */}
              <div>
                <BuyerDetails formData={formData} setFormData={setFormData} />
              </div>
              {/* Seller-Specific Details */}
              {role === "seller" && (
                <div>
                  <SellerDetails
                    sellerDetails={sellerDetails}
                    setSellerDetails={setSellerDetails}
                    banks={banks}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
              >
                {loading ? <Loader /> : "Sign Up"}
              </button>
            </div>
          </form>
        )}
        <NotificationModal
          visible={notification.visible}
          message={notification.message}
          success={notification.success}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/sign-in" className="text-green-600 font-semibold">
            Sign In here!
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
