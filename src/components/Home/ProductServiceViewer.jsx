"use client";

import React from "react";
import ProductCard from "../Shop/Products/ProductCard";
import ServiceCard from "../Services/ServiceCard";
import SkeletonCard from "../Shop/SkelotonCard";

const ProductServiceViewer = ({
  selectedMode,
  selectedCategory,
  products,
  services,
  loadingProducts,
  loadingServices,
  productsPerPage,
  onChatWithSeller,
}) => {
  const displayedItems =
    selectedMode === "products"
      ? products.filter(
          (product) =>
            selectedCategory === "all" || product.category === selectedCategory
        )
      : services.filter(
          (service) =>
            selectedCategory === "all" || service.category === selectedCategory
        );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 md:mx-32 mx-0 max-[760px]:ml-8">
      {selectedMode === "products"
        ? loadingProducts
          ? Array.from({ length: productsPerPage }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : displayedItems
              .slice(0, productsPerPage)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
        : loadingServices
        ? Array.from({ length: productsPerPage }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        : displayedItems
            .slice(0, productsPerPage)
            .map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onChatWithSeller={onChatWithSeller}
              />
            ))}
    </div>
  );
};

export default ProductServiceViewer;
