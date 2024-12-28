import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons

const BuyerDetails = ({ formData, setFormData }) => {
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Toggle password visibility
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
        Create Your Account
      </h2>
      <form className="space-y-6">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // Conditionally set type based on showPassword
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
          required
        />
      </form>
    </div>
  );
};

export default BuyerDetails;
