"use client";

import { useState } from "react";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Subscription successful!");
        setEmail(""); // Clear the email input after successful submission
      } else {
        setMessage("Subscription failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-red-600 p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start">
        {/* First Column */}
        <div className="flex items-center mb-6 md:mb-0 w-full md:w-1/3">
          <FaEnvelope size={40} className="mr-3" />
          <div>
            <h2 className="text-lg font-bold">Subscribe to our Newsletter</h2>
            <p className="text-sm">Stay updated with the latest news</p>
          </div>
        </div>

        {/* Second Column */}
        <div className="mb-6 md:mb-0 text-center w-full md:w-1/3">
          <p className="text-sm">
            ... and receive a <span className="font-bold">10% discount</span> on
            your first purchase.
          </p>
        </div>

        {/* Third Column */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center w-full md:w-1/3"
        >
          <div className="relative w-full md:w-auto flex-grow">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 pl-10 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
            />
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-800 text-white py-3 px-6 rounded-md mt-4 md:mt-0 md:ml-3 hover:bg-green-700 transition inline-flex items-center justify-center"
          >
            {isSubmitting ? (
              "Subscribing..."
            ) : (
              <>
                Subscribe <FaPaperPlane className="ml-2" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Message Section */}
      {message && (
        <div className="mt-4 text-sm text-center">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
