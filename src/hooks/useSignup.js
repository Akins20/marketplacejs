"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { format } from "date-fns";
import { auth, firestore } from "@/firebase";
import { useRouter } from "next/navigation";

const useSignUp = () => {
  const router = useRouter();
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

  useEffect(() => {
    if (role === "seller") {
      fetchBanks();
    }
  }, [role]);

  const fetchBanks = async () => {
    try {
      const response = await fetch("/api/transaction-auth");
      const data = await response.json();
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
          await setDoc(doc(firestore, userCollection, uid), userData);
          await setDoc(doc(firestore, "users", uid), {
            ...userData,
            bankName: sellerDetails.bankName,
          });
          router.push("/");
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
          await setDoc(doc(firestore, userCollection, uid), {
            ...userData,
            bank_details: bankData,
          });
          await setDoc(doc(firestore, "users", uid), {
            ...userData,
            bank_details: bankData,
          });
          router.push("/");
          break;
        default:
          throw new Error("Invalid role");
      }

      setNotification({
        visible: true,
        message: `Account created successfully as a ${role}!`,
        success: true,
      });
      setTimeout(() => router.replace("/"), 1000);
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

  return {
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
  };
};

export default useSignUp;
