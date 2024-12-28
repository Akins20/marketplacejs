import React, { useState, useEffect } from "react";
import ProviderServicesModal from "./ProviderServicesModal"; // Adjust import path as necessary
import { FiLoader } from "react-icons/fi";
import { fetchProviderServices } from "../Functions/ServiceUtils";
import Image from "next/image";
import Pagination from "@/components/Pagination";

const MAX_SERVICES_PER_PAGE = 6; // Max number of services per page

const ProviderServices = ({ adminInfo }) => {
  const adminId = adminInfo?.uniqueId;

  // State variables
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [providerServices, setProviderServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (adminId) {
      refreshServices();
    }
  }, [adminId]);

  const refreshServices = async () => {
    setIsLoading(true);
    try {
      const newServices = await fetchProviderServices(adminId);
      setProviderServices(newServices);
      setTotalPages(Math.ceil(newServices.length / MAX_SERVICES_PER_PAGE)); // Calculate total pages
    } catch (error) {
      console.error("Failed to refresh services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract categories and user services
  const categories = Array.from(
    new Set(providerServices.map((service) => service.category))
  ); // Get unique categories

  // Filtered services based on selected category
  const filteredServices = providerServices.filter(
    (service) =>
      selectedCategory === "" || service.category === selectedCategory
  );

  // Get paginated services for the current page
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * MAX_SERVICES_PER_PAGE,
    currentPage * MAX_SERVICES_PER_PAGE
  );

  // Function to handle image click
  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedService(null);
    setSelectedImage(null);
  };

  return (
    <>
      {/* Categories Filter */}
      <div className="flex flex-col min-h-screen p-4 md:p-8">
        <div className="flex justify-start mb-4">
          <ul className="flex flex-wrap space-x-4 ml-0 md:ml-4">
            <li
              className={`cursor-pointer px-4 py-1 rounded ${
                selectedCategory === ""
                  ? "font-bold bg-pink-900 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => setSelectedCategory("")}
            >
              All
            </li>
            {categories.map((category, index) => (
              <li
                key={index}
                className={`cursor-pointer rounded-full px-4 py-1 ${
                  selectedCategory === category
                    ? "font-bold bg-pink-900 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        <button
          className="bg-pink-800 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mb-4"
          onClick={refreshServices}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Refreshing...
            </>
          ) : (
            "Refresh Services"
          )}
        </button>

        <div className="overflow-x-auto">
          {/* Display user's services */}
          {paginatedServices.length > 0 ? (
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Service Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Images</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.map((service, index) => (
                  <tr
                    key={index}
                    className="border-t cursor-pointer border-gray-400 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedService(service);
                      setSelectedImage(service.images[0]);
                    }}
                  >
                    <td className="px-4 py-2 truncate max-w-xs">
                      {service.title}
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {service.category}
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {service.location}
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      ₦{service.price}
                    </td>
                    <td className="px-4 py-2">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {service.images.map((image, imgIndex) => (
                          <Image
                            key={imgIndex}
                            src={image}
                            layout="contained"
                            width={100}
                            height={100}
                            alt={`Service ${imgIndex + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No services found for your account.</p>
          )}
        </div>
      </div>

      {/* Pagination Component */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal for displaying service details */}
      {selectedService && (
        <ProviderServicesModal
          selectedService={selectedService}
          selectedImage={selectedImage}
          handleImageClick={handleImageClick}
          closeModal={closeModal}
          refreshServices={refreshServices}
        />
      )}
    </>
  );
};

export default ProviderServices;
