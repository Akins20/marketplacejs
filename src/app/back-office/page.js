"use client";

import { useState, useEffect } from "react";
import BackOffice from "@/components/BackOffice/Office";
import useProvideAuth from "@/components/generalUtils/useAuth";
import AdminSignIn from "@/components/BackOffice/Auth/AdminSignin";
import AdminSignUp from "@/components/BackOffice/Auth/AdminSignup";

const AdminOffice = () => {
  const { admin } = useProvideAuth();
  const [activeTab, setActiveTab] = useState("signin"); // Manage tab state
  const [animate, setAnimate] = useState(false); // Manage animation state

  useEffect(() => {
    // Trigger animation each time the active tab changes
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300); // Remove animation after 300ms
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Function to toggle between Sign In and Sign Up
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800">
      {admin ? (
        <BackOffice user={admin} />
      ) : (
        <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg relative">
          {/* Pills for toggling between Sign In and Sign Up */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => toggleTab("signin")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === "signin"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => toggleTab("signup")}
              className={`px-6 py-2 ml-2 rounded-full transition-all duration-300 ${
                activeTab === "signup"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Animated container for Sign In and Sign Up */}
          <div
            className={`transition-all duration-300 ease-in-out transform ${
              animate ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"
            }`}
          >
            {activeTab === "signin" ? <AdminSignIn /> : <AdminSignUp />}
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminOffice;
