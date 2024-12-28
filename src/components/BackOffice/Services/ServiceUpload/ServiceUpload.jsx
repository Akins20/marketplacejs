import React, { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import ServiceUploadModal from "./ServiceUploadModal";
import {
  createService,
  uploadImageToFirebase,
} from "../../Functions/ServiceUtils";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import Image from "next/image";
import { useServiceCategoryData } from "@/hooks/useServiceCategoryData";

const ServiceUpload = ({ adminInfo }) => {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]); // For image file uploads
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { categories: serviceCategories } = useServiceCategoryData();

  useEffect(() => {
    if (adminInfo) {
      setCategories(serviceCategories);
    }
  }, [adminInfo, serviceCategories]);

  // Function to handle service upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (
      serviceName &&
      description &&
      price &&
      location &&
      images // Ensure at least one image is selected
    ) {
      try {
        setLoading(true);

        // Upload images to Firebase Storage and get the URLs
        const imageUrls = await Promise.all(images.map(uploadImageToFirebase));
        const serviceId = uuidv4(); // Generate unique service ID
        const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss"); // Format creation date

        const serviceData = {
          id: serviceId,
          title: serviceName.slice(0, 50),
          description: description.slice(0, 1500),
          price: parseFloat(price),
          location,
          category: category.title || "General",
          images: imageUrls, // Add image URLs
          sellerEmail: adminInfo.email,
          sellerId: adminInfo.uniqueId, // Seller's unique ID
          creationDate, // Capture the creation date
        };

        // Upload service data to Firestore
        await createService(serviceData, adminInfo.uniqueId);

        // Clear form fields and show success message
        setServiceName("");
        setDescription("");
        setPrice("");
        setLocation("");
        setCategory("");
        setImages([]);
        setModalMessage("Service uploaded successfully!");
      } catch (error) {
        setModalMessage(`Error uploading service: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setModalMessage(
        "Please fill out all fields and upload at least one image."
      );
    }
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <form
            className="bg-white p-6 rounded-lg shadow-lg space-y-4"
            onSubmit={handleUpload}
          >
            {/* Service Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={1000}
                required
              ></textarea>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`bg-indigo-600 text-white p-3 rounded w-full mt-4 transition-colors ${
                loading ? "cursor-not-allowed" : "hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Service"}
            </button>
          </form>
        </div>

        {/* Image Upload Section */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            {/* Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category
              </label>
              <select
                value={category.title}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload Component */}
            <ImageUpload images={images} setImages={setImages} />

            {/* Image Previews */}
            <div className="grid grid-cols-3 gap-2">
              {images.map((imgUrl, index) => (
                <div key={index} className="h-32 w-32 overflow-hidden rounded">
                  <Image
                    src={URL.createObjectURL(imgUrl)}
                    layout="contained"
                    width={100}
                    height={100}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for success/failure messages */}
      {showModal && (
        <ServiceUploadModal message={modalMessage} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default ServiceUpload;
