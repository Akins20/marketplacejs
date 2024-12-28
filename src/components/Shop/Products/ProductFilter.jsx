"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaTag, FaDollarSign } from "react-icons/fa";

const ProductFilter = ({ allProducts, onFilter }) => {
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    brand: "",
    tags: [],
    minPrice: 0,
    maxPrice: 50000,
  });

  const categories = [
    ...new Set(allProducts.map((product) => product.category)),
  ];
  const brands = [...new Set(allProducts.map((product) => product.brand))];
  const allTags = [
    ...new Set(
      allProducts.flatMap((product) => product.tags?.split(",").slice(0, 6) || [])
    ),
  ];

  // Update filters on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Handle tag change for multiple selection
  const handleTagChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      tags: prevFilters.tags.includes(value)
        ? prevFilters.tags.filter((tag) => tag !== value)
        : [...prevFilters.tags, value],
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: parseInt(value, 10),
    }));
  };

  useEffect(() => {
    const filteredProducts = allProducts.filter((product) => {
      const matchesTitle = product.title
        .toLowerCase()
        .includes(filters.title.toLowerCase());
      const matchesCategory = filters.category
        ? product.category === filters.category
        : true;
      const matchesBrand = filters.brand
        ? product.brand === filters.brand
        : true;
      const matchesTags =
        filters.tags.length > 0
          ? filters.tags.some((tag) =>
              product.tags
                ?.split(",")
                .map((t) => t.trim())
                .includes(tag)
            )
          : true;
      const matchesPrice =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;

      return (
        matchesTitle &&
        matchesCategory &&
        matchesBrand &&
        matchesTags &&
        matchesPrice
      );
    });

    onFilter(filteredProducts);
  }, [filters, allProducts]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg transition-all ease-in-out duration-300">
      <h2 className="text-lg font-bold mb-4">
        Filter Products
      </h2>
      <div className="space-y-4">
        {/* Title Filter */}
        <div className="relative">
          <label className="block text-gray-700 mb-2">
            <FaSearch className="inline-block mr-2" /> Search by Name
          </label>
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={handleInputChange}
            placeholder="Product tnameitle"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-gray-700 mb-2">
            <FaTag className="inline-block mr-2" /> Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-gray-700 mb-2">
            Brand
          </label>
          <select
            name="brand"
            value={filters.brand}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Filter */}
        <div>
          <label className="block text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <label
                key={tag}
                className={`cursor-pointer px-3 py-1 border rounded-full text-sm transition-all duration-200 ease-in-out ${
                  filters.tags.includes(tag)
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  value={tag}
                  checked={filters.tags.includes(tag)}
                  onChange={handleTagChange}
                  className="hidden"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <label className="block text-gray-700 mb-2">
            <FaDollarSign className="inline-block mr-2" /> Price Range
          </label>
          <div className="flex items-center justify-between space-x-4">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handlePriceChange}
              placeholder="Min Price"
              className="w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              placeholder="Max Price"
              className="w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
