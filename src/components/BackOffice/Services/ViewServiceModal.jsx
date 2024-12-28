import React, { useState } from "react";
import ServiceUpload from "./ServiceUpload/ServiceUpload";
import Image from "next/image";

const ViewServiceModal = ({ service, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(service.images[0]);
  const [isEditing, setIsEditing] = useState(false);

  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-3/4 h-3/4 overflow-auto relative">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-4">
            <h2 className="text-2xl font-bold mb-4">{service.serviceName}</h2>
            <p className="mb-4">{service.description}</p>
            <p className="mb-4">
              <strong>Price:</strong> ${service.price}
            </p>
            <p className="mb-4">
              <strong>Location:</strong> {service.location}
            </p>
            <p className="mb-4">
              <strong>Category:</strong> {service.category}
            </p>
          </div>
          <div className="flex-1 p-4">
            <div>
              <Image
                src={selectedImage}
                layout="contained"
                width={100}
                height={100}
                alt={service.serviceName}
                className="w-full h-64 object-cover rounded mb-4"
              />
              <div className="grid grid-cols-3 gap-4">
                {service.images.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    layout="contained"
                    width={100}
                    height={100}
                    alt={`Service ${index + 1}`}
                    className={`w-full h-24 object-cover rounded cursor-pointer ${
                      selectedImage === url ? "border-2 border-pink-500" : ""
                    }`}
                    onClick={() => handleImageClick(url)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          {isEditing ? (
            <>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleEdit}
              >
                Edit Service
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
            </>
          ) : (
            <ServiceUpload initialData={service} onClose={closeModal} />
          )}
          <button
            onClick={handleCloseClick}
            className="mt-4 mx-6 bg-blue-500 text-white p-2 rounded self-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewServiceModal;
