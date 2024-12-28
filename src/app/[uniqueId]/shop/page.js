"use client"

import Shop from "@/components/Shop/Shop";
import { useProductData } from "@/hooks/useProductData";
import { useEffect, useState } from "react";

const SellerShop = ({ params }) => {
  const { uniqueId } = params; // Unique ID from the URL
  const { products, loading, error } = useProductData(); // Get all products
  const [sellerProducts, setSellerProducts] = useState([]); // State to store filtered products

  useEffect(() => {
    if (products.length > 0) {
      // Filter products by matching sellerId with the uniqueId
      const filteredProducts = products.filter(
        (product) => product.sellerId === uniqueId
      );
      setSellerProducts(filteredProducts);
    }
  }, [products, uniqueId]);

  return (
    <main className="min-h-screen bg-white">
      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : sellerProducts.length === 0 ? (
        <div>No products found for this seller.</div>
      ) : (
        <Shop userProducts={sellerProducts} /> // Pass filtered products to Shop component
      )}
    </main>
  );
};

export default SellerShop;
