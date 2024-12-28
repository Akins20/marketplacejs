"use client";

import React from "react";

const CategoryButtonPicker = ({
  categories,
  selectedCategory,
  onSelectCategory,
  visibleCategoriesCount,
  onToggleCategories,
  selectedMode,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 my-8 w-auto">
      <button
        className={`px-4 py-2 text-sm font-medium ${
          selectedCategory === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
        } rounded-lg transition-colors hover:bg-blue-400`}
        onClick={() => onSelectCategory("all")}
      >
        All {selectedMode === "products" ? "Products" : "Services"}
      </button>

      {categories.slice(0, visibleCategoriesCount).map((category) => (
        <button
          key={category.id}
          className={`px-4 py-2 text-sm font-medium ${
            selectedCategory === category.title
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          } rounded-lg transition-colors hover:bg-blue-400`}
          onClick={() => onSelectCategory(category.title)}
        >
          {category.title}
        </button>
      ))}

      <button
        className="px-4 py-2 bg-gray-300 text-sm font-medium rounded-lg hover:bg-gray-400"
        onClick={onToggleCategories}
      >
        {visibleCategoriesCount >= categories.length
          ? "Show Less"
          : "Show More"}
      </button>
    </div>
  );
};

export default CategoryButtonPicker;
