"use client";
import React, { useState } from "react";
import { auth } from "@/firebase"; // Adjust path as necessary
import { sendPasswordResetEmail } from "firebase/auth";
import NotificationModal from "../NotificationModal";
import Loader from "../Loader";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    success: false,
  });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setNotification({
        visible: true,
        message: "Password reset email sent!",
        success: true,
      });
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

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>
      <form onSubmit={handleResetPassword} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          {loading ? <Loader /> : "Send Reset Email"}
        </button>
      </form>
      <NotificationModal
        visible={notification.visible}
        message={notification.message}
        success={notification.success}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </div>
  );
};

export default ForgotPasswordPage;
