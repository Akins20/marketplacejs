"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaTag, FaDollarSign } from "react-icons/fa";

const ServiceFilter = ({ allServices, onFilter }) => {
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    tags: [],
    minPrice: 0,
    maxPrice: 50000,
  });

  const categories = [
    ...new Set(allServices.map((service) => service.category)),
  ];

  const allTags = [
    ...new Set(
      allServices.flatMap((service) => service.tags?.split(",") || [])
    ),
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

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
    const filteredServices = allServices.filter((service) => {
      const matchesTitle = service.title
        .toLowerCase()
        .includes(filters.title.toLowerCase());
      const matchesCategory = filters.category
        ? service.category === filters.category
        : true;
      const matchesTags =
        filters.tags.length > 0
          ? filters.tags.some((tag) => service.tags?.split(",").includes(tag))
          : true;
      const matchesPrice =
        service.price >= filters.minPrice && service.price <= filters.maxPrice;

      return matchesTitle && matchesCategory && matchesTags && matchesPrice;
    });

    onFilter(filteredServices);
  }, [filters, allServices]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg transition-all ease-in-out duration-300">
      <h2 className="text-lg font-bold mb-4">Filter Services</h2>
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
            placeholder="Service name"
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

        {/* Tags Filter */}
        <div>
          <label className="block text-gray-700 mb-2">Tags</label>
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

export default ServiceFilter;
