"use client";

import { useState, useEffect } from "react";
import { FaUser, FaUserShield, FaUserTag } from "react-icons/fa";
import { storage, firestore } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import Loader from "@/components/Loader"; // Assuming you have a Loader component
import Image from "next/image"; // For image display

const AdminInfo = ({ adminInfo }) => {
  const [formData, setFormData] = useState({
    firstName: adminInfo?.firstName || "",
    lastName: adminInfo?.lastName || "",
    email: adminInfo?.email || "",
    phoneNumber: adminInfo?.phoneNumber || "",
    address: adminInfo?.address || "",
    state: adminInfo?.state || "",
    city: adminInfo?.city || "",
    postalCode: adminInfo?.postalCode || "",
    accountNumber: adminInfo?.accountNumber || "",
    adminImage: adminInfo?.adminImage || null,
  });

  const [imagePreview, setImagePreview] = useState(
    adminInfo?.adminImage || null
  );
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    if (!adminInfo) {
      setNotification({ message: "No admin data available.", type: "error" });
    }
  }, [adminInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let updatedImageUrl = formData.adminImage;

      // Upload new image if there's one selected
      if (imageFile) {
        const imageRef = ref(storage, `admin_images/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        updatedImageUrl = await getDownloadURL(snapshot.ref);
      }

      // Only update fields that have changed
      const updatedAdminData = {};

      // Check each field and only include it in update if it was changed
      if (formData.firstName !== adminInfo.firstName) {
        updatedAdminData.firstName = formData.firstName;
      }
      if (formData.lastName !== adminInfo.lastName) {
        updatedAdminData.lastName = formData.lastName;
      }
      if (formData.phoneNumber !== adminInfo.phoneNumber) {
        updatedAdminData.phoneNumber = formData.phoneNumber;
      }
      if (formData.address !== adminInfo.address) {
        updatedAdminData.address = formData.address;
      }
      if (formData.state !== adminInfo.state) {
        updatedAdminData.state = formData.state;
      }
      if (formData.city !== adminInfo.city) {
        updatedAdminData.city = formData.city;
      }
      if (formData.postalCode !== adminInfo.postalCode) {
        updatedAdminData.postalCode = formData.postalCode;
      }
      if (formData.accountNumber !== adminInfo.accountNumber) {
        updatedAdminData.accountNumber = formData.accountNumber;
      }
      if (updatedImageUrl !== adminInfo.adminImage) {
        updatedAdminData.adminImage = updatedImageUrl;
      }

      // Only update Firestore if there is something to update
      if (Object.keys(updatedAdminData).length > 0) {
        const adminDocRef = doc(firestore, "sellers", adminInfo.id);
        await updateDoc(adminDocRef, updatedAdminData);
        setNotification({
          message: "Profile updated successfully!",
          type: "success",
        });
      } else {
        setNotification({
          message: "No changes detected.",
          type: "info",
        });
      }

      setImageFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        message: "Error updating profile. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white shadow-md rounded-md p-6 mb-10">
      <h2 className="text-xl font-semibold mb-4">
        <FaUserShield className="inline mr-2 text-green-500" />
        Admin Information
      </h2>

      {/* Notification Section */}
      {notification.message && (
        <div
          className={`mb-4 text-white px-4 py-2 rounded-md ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Picture Upload */}
        <div className="flex items-center space-x-4 my-4">
          <div>
            {imagePreview ? (
              <Image
                src={imagePreview}
                layout="fixed"
                alt="Profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <FaUser className="text-7xl text-gray-500 mr-6 rounded-full " />
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Profile Picture:
            </label>
            <input type="file" onChange={handleImageUpload} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* State */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">State:</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Postal Code */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Postal Code:</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Account Number */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Account Number:</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email (Non-changeable) */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="p-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          disabled={loading}
        >
          {loading ? <Loader /> : "Save Changes"}
        </button>
      </form>
    </section>
  );
};

export default AdminInfo;
