"use client";
import { useState, useEffect } from "react";
import { FaUpload, FaUserEdit } from "react-icons/fa";
import { storage, firestore } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import Loader from "@/components/Loader"; // Assuming you have a Loader component
import Image from "next/image";

const UserInfo = ({ userInfo, handleUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName,
    lastName: userInfo?.lastName,
    email: userInfo?.email,
    address: userInfo?.address,
    userImage: userInfo?.userImage,
  });
  const [imagePreview, setImagePreview] = useState(userInfo?.userImage || null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userImageUrl = formData.userImage;

      //Determine collection name
      const collectionName = userInfo.role === "buyer" ? "users" : "admins";
      const storagePath =
        userInfo.role === "buyer" ? "user_images" : "admin_images";

      // Upload the image to Firebase Storage if a new image is selected
      if (imageFile) {
        const imageRef = ref(storage, `${storagePath}/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        userImageUrl = await getDownloadURL(snapshot.ref);
      }

      // Update Firestore with the new user data
      const userDocRef = doc(firestore, `${collectionName}`, userInfo.id);
      await updateDoc(userDocRef, {
        ...formData,
        userImage: userImageUrl,
      });

      // Call the update function to handle UI state update
      handleUpdate({ ...formData, userImage: userImageUrl });

      // Show success notification
      setNotification({
        message: "Profile updated successfully!",
        type: "success",
      });
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
    <section className="bg-white shadow-md rounded-md p-6 mb-10 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-green-500">
        <FaUserEdit className="mr-2" />
        User Information
      </h2>

      {/* Notification Message */}
      {notification.message && (
        <div
          className={`mb-4 text-white px-4 py-2 rounded-md ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Display user info in a form if the user can edit; else display text */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">
              First Name:
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex items-center space-x-6 mt-6">
          <div>
            {imagePreview ? (
              <Image
                src={imagePreview}
                layout="intrinsic"
                width={80}
                height={80}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-300"
              />
            ) : (
              <p className="text-gray-600">No profile picture uploaded</p>
            )}
          </div>

          {/* Allow image upload only if the user can edit */}
          <div className="flex flex-col">
            <label className="block text-gray-700 font-medium mb-2">
              Profile Picture:
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-900"
            />
            <p className="text-sm text-gray-500 mt-1">
              {imageFile ? imageFile.name : "No file chosen"}
            </p>
          </div>
        </div>

        {/* Save Changes button, only if the user can edit */}
        <button
          type="submit"
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          disabled={loading}
        >
          {loading ? <Loader /> : "Save Changes"}
        </button>
      </form>
    </section>
  );
};

export default UserInfo;
