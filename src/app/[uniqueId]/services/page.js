"use client";

import Services from "@/components/Services/Services";
import { useEffect, useState } from "react";
import { useServiceData } from "@/hooks/useServiceData"; // Assuming you have this hook

const SellerServices = ({ params }) => {
  const { uniqueId } = params; // Unique ID from the URL
  const { services, loading, error } = useServiceData(); // Fetch all services using the custom hook
  const [sellerServices, setSellerServices] = useState([]); // State to store filtered services

  useEffect(() => {
    if (services.length > 0) {
      // Filter services by matching sellerId with the uniqueId
      const filteredServices = services.filter(
        (service) => service.sellerId === uniqueId
      );
      setSellerServices(filteredServices);
    }
  }, [services, uniqueId]);

  return (
    <main className="min-h-screen bg-white">
      {loading ? (
        <div>Loading services...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : sellerServices.length === 0 ? (
        <div>No services found for this seller.</div>
      ) : (
        <Services userServices={sellerServices} /> // Pass filtered services to Services component
      )}
    </main>
  );
};

export default SellerServices;
