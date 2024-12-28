import React, { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import {
  updateServiceData,
  uploadImageToFirebase,
} from "../../Functions/ServiceUtils";
import { fetchCategories } from "../../Functions/CategoryUtils";
import Image from "next/image";
import { FiX } from "react-icons/fi";

const ModifyService = ({ initialService, authData, onClose }) => {
  const [serviceName, setServiceName] = useState(initialService.title || "");
  const [description, setDescription] = useState(
    initialService.description || ""
  );
  const [price, setPrice] = useState(initialService.price || "");
  const [location, setLocation] = useState(initialService.location || "");
  const [category, setCategory] = useState(initialService.category || "");
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState(initialService.images || []);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      const fetchedCategories = await fetchCategories();
      console.log("Fetched categories:", JSON.stringify(fetchedCategories));
      setCategories(fetchedCategories);
    };
    fetchCategoryData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (
        !serviceName ||
        !description ||
        !price ||
        !location ||
        !category ||
        images.length === 0
      ) {
        throw new Error(
          "Please fill out all fields and upload at least one image."
        );
      }

      // Convert images to URLs if they are new uploads (File objects)
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          if (typeof image === "string") {
            return image; // Existing image URL
          } else {
            return await uploadImageToFirebase(image); // Upload new image and return URL
          }
        })
      );

      const serviceData = {
        title: serviceName,
        description: description,
        price: parseFloat(price),
        location,
        category: category || "General",
        images: imageUrls,
      };

      // Update service data in Firestore
      await updateServiceData(initialService.id, serviceData);

      setModalMessage("Service updated successfully!");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        onClose();
      }, 2000);
    } catch (error) {
      setModalMessage(`Error updating service: ${error.message}`);
      setShowModal(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-gray-800">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-5xl h-full max-h-[90vh] overflow-auto flex flex-col md:flex-row">
        {/* Image Column for Desktop */}
        <div className="md:w-1/3 w-full flex-shrink-0 mb-4 md:mb-0">
          <div className="space-y-4">
            <ImageUpload images={images} setImages={setImages} />
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-2/3 w-full flex-shrink-0">
          <button
            className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FiX />
          </button>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Service Name"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full px-2 mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-2 h-32 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="w-full px-2 mb-4">
              <button
                type="submit"
                className="bg-pink-800 text-white p-2 rounded w-full mt-4 hover:bg-pink-700 transition"
              >
                Update Service
              </button>
            </div>
          </form>
        </div>

        {/* Modal for Success/Error messages */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <p>{modalMessage}</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModifyService;
