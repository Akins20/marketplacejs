import React, { useState } from "react";
import { motion } from "framer-motion";
import { deleteService } from "../Functions/ServiceUtils";
import ModifyService from "./ModifyService/ModifyService";
import Image from "next/image";
import { FiX } from "react-icons/fi";

const ProviderServicesModal = ({
  selectedService,
  selectedImage,
  handleImageClick,
  closeModal,
  refreshServices,
  authData,
  services,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteService(selectedService.id, selectedService.sellerId);
      alert(
        `Service "${selectedService.title}" has been deleted successfully.`
      );
      closeModal(); // Close the modal after deleting
      refreshServices(); // Refresh services after deletion
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    refreshServices(); // Refresh services after editing
    closeModal(); // Close the modal after editing
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-3xl h-[90vh] overflow-y-auto">
        {!isEditing ? (
          <>
            <button
              className="absolute top-0 right-1 text-red-500 z-50 text-2xl"
              onClick={closeModal}
            >
              <FiX />
            </button>
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-4">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedService.title}
                </h2>
                <p className="mb-4">{selectedService.description}</p>
                <p className="mb-4">
                  <strong>Price:</strong> ₦{selectedService.price}
                </p>
                <p className="mb-4">
                  <strong>Location:</strong> {selectedService.location}
                </p>
                <p className="mb-4">
                  <strong>Category:</strong> {selectedService.category}
                </p>
              </div>
              <div className="flex-1 p-4">
                <Image
                  src={selectedImage || selectedService.images[0]}
                  alt={selectedService.title}
                  layout="contained"
                  width={100}
                  height={100}
                  className="w-full h-64 object-cover rounded mb-4"
                />
                <div className="grid grid-cols-3 gap-4">
                  {selectedService.images.map((url, index) => (
                    <Image
                      key={index}
                      src={url}
                      layout="contained"
                      width={100}
                      height={100}
                      alt={`Service ${index + 1}`}
                      className={`w-full h-20 object-cover rounded cursor-pointer ${
                        selectedImage === url ? "border-2 border-pink-500" : ""
                      }`}
                      onClick={() => handleImageClick(url)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <ModifyService
            initialService={selectedService}
            authData={authData}
            onClose={handleEditClose}
            services={services}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ProviderServicesModal;
