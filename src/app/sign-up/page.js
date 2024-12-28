"use client";

import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { format } from "date-fns";
import { auth, firestore } from "@/firebase";
import RoleSelector from "@/components/Auth/RoleSelector";
import BuyerDetails from "@/components/Auth/BuyerDetails";
import SellerDetails from "@/components/Auth/SellerDetails";
import NotificationModal from "@/components/NotificationModal";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [sellerDetails, setSellerDetails] = useState({
    bankName: "",
    bankCode: "",
    accountNumber: "",
    businessName: "",
  });
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    success: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (role === "seller") {
      fetchBanks();
    }
  }, [role]);

  const fetchBanks = async () => {
    try {
      const response = await fetch("/api/transaction-auth");
      const data = await response.json();
      console.log("This is bank ", JSON.stringify(data));
      setBanks(data.banks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const uid = userCredential.user.uid;

      const uniqueId = `${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}-${format(
        new Date(),
        "yyyyMMdd"
      )}`;

      const userData = {
        ...formData,
        uniqueId,
        role,
        ...(role === "seller" && sellerDetails),
      };

      const userCollection = role === "seller" ? "sellers" : "users";
      switch (role) {
        case "buyer":
          await setDoc(doc(firestore, userCollection, uid), {
            ...userData,
          });
          await setDoc(doc(firestore, "users", uid), {
            ...userData,
            bankName: sellerDetails.bankName,
          });

          setNotification({
            visible: true,
            message: `Account created successfully as a ${role}!`,
            success: true,
          });
          break;
        case "seller":
          const { bankCode, accountNumber, businessName } = sellerDetails;

          const response = await fetch("/api/transaction-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bankCode,
              accountNumber,
              businessName,
              email: formData.email,
              fullName: formData.firstName + " " + formData.lastName,
              phoneNumber: formData.phoneNumber,
            }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
          }
          const bankData = await response.json();
          console.log("Fetched seller subaccount data:", bankData); // Assume API returns { banks: [{ name, code }] }
          await setDoc(doc(firestore, userCollection, uid), {
            ...userData,
            bank_details: bankData,
          });
          await setDoc(doc(firestore, "users", uid), {
            ...userData,
            bank_details: bankData,
          });

          setNotification({
            visible: true,
            message: `Account created successfully as a ${role}!`,
            success: true,
          });
          setTimeout(() => router.replace("/"), 2000);
          break;
        default:
          throw new Error("Invalid role");
      }
    } catch (error) {
      setNotification({
        visible: true,
        message: error.message,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-300 py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
        <p className="text-center text-gray-500 mb-6">
          Create an account to start shopping or selling products!
        </p>
        <RoleSelector role={role} setRole={setRole} />
        {role && (
          <form onSubmit={handleSignUp}>
            <div
              className={`grid grid-cols-1 gap-6 transition-transform duration-700 ${
                role === "seller" ? "grid-cols-2" : ""
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
