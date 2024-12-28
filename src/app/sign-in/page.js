"use client";
import React, { useState } from "react";
import { auth } from "@/firebase"; // Adjust path as necessary
import { signInWithEmailAndPassword } from "firebase/auth";
import Loader from "@/components/Loader"; // Assume you have a Loader component
import NotificationModal from "@/components/NotificationModal"; // Assume you have a Notification modal
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    success: false,
  });
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setNotification({
        visible: true,
        message: "Sign in successful! Welcome back!",
        success: true,
      });
      // Optionally redirect the user after successful sign-in
      setTimeout(() => {
        router.replace("/");
      }, 2000);
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-300 py-10 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md transition-transform transform hover:scale-105 text-gray-700">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Megacommerce
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Enter your credentials to sign in and access your account!
        </p>
        <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            {loading ? <Loader /> : "Sign In"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6">
          Don&apos;t have an account?
          <a href="/sign-up" className="text-green-600 font-semibold">
            Sign Up here!
          </a>
        </p>
        <NotificationModal
          visible={notification.visible}
          message={notification.message}
          success={notification.success}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      </div>
    </div>
  );
};

export default SignInPage;
