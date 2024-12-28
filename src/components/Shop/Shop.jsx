"use client";

import { useEffect, useState } from "react";
import ProductCard from "./Products/ProductCard";
import ProductFilter from "./Products/ProductFilter";
import { useProductData } from "@/hooks/useProductData"; // Use product data hook

const Shop = ({ userProducts }) => {
  const { products, loading: loadingProducts } = useProductData();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    if (!userProducts) {
      setAllProducts(products);
      setFilteredProducts(products);
    } else {
      setAllProducts(userProducts);
      setFilteredProducts(userProducts);
    }
  }, [products, userProducts]);

  const handleFilter = (filtered) => {
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="mx-auto py-10 px-4 lg:px-16 bg-white text-gray-800 max-[760px]:pt-10">
      <h1 className="text-3xl font-bold text-center mb-8">Shop Products</h1>
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        {/* Product Filter */}
        <div className="md:w-1/4 w-full">
          <ProductFilter allProducts={allProducts} onFilter={handleFilter} />
        </div>

        {/* Product Grid */}
        <div className="md:flex-grow w-full">
          {loadingProducts ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-0 max-[760px]:ml-8">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-20">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-700 transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-2 text-white py-2 px-3 rounded-md ${
                  currentPage === index + 1
                    ? "bg-green-700"
                    : "bg-green-800 hover:bg-green-700"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-700 transition ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
