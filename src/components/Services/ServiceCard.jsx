"use client";

import { useState } from "react";
import { FaUserTag } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../generalUtils/generalFunctions";
import { renderStars } from "@/components/generalUtils/generalFunctions";
import useProvideAuth from "../generalUtils/useAuth";
import useSellerCheck from "@/hooks/useSellerCheck";

const ServiceCard = ({ service, onChatWithSeller }) => {
  const { admin, loading } = useProvideAuth();
  const { isProductSoldBySeller } = useSellerCheck(); // Hook to check if the product is sold by a verified seller

  const formatTitle = (title) => title.trim().replace(/\s+/g, "-");

  const handleChatClick = () => {
    onChatWithSeller(service); // Pass the service information when chat is triggered
  };
  
  return (
    <div className="w-64 bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-l transition-transform hover:scale-105 relative">
      <div className="relative h-60">
        {/* Service Image */}
        <Image
          src={service.images[0]}
          layout="fill"
          alt={service.title}
          className="object-cover"
          loading="lazy"
        />
         {/* Seller Badge */}
         {isProductSoldBySeller(service) ? (
          <Link href={`/${service.sellerId}`} prefetch={true} target="blank"
            className="absolute z-20 top-2 left-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
            <FaUserTag />
            <span>Verified Seller</span>
          </Link>
        ) : (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
            <FaUserTag />
            <span>Unverified Seller</span>
          </div>
        )}

      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-light text-gray-600">{service.category}</p>
        </div>
        <h2 className="text-xl font-bold mb-2">{service.title}</h2>
        <div className="mb-2">{renderStars(service)}</div>
        <p className="text-gray-600">{service.description.slice(0, 100)}...</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(service.price)}
          </span>

          {!loading && admin?.uniqueId !== service.sellerId ? (
            <button
              className="bg-blue-500 text-white px-2 py-2 rounded text-sm"
              onClick={handleChatClick}
            >
              Chat with Seller
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
