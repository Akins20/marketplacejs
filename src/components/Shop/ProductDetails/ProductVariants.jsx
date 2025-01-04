import Image from "next/image";
import { FaStar, FaShoppingCart, FaArrowRight } from "react-icons/fa";

const ProductVariants = ({
  variants,
  selectedVariant,
  setSelectedVariant,
  isVariant,
  handleVariantChange,
}) => {
  if (!isVariant) return null;

  return (
    <div className="space-y-6">
      {/* Variant Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {variants.map((variant) => (
          <div
            key={variant.variantId}
            className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedVariant?.variantId === variant.variantId
                ? "border-green-500 shadow-md scale-105"
                : "border-gray-200 hover:border-gray-400"
            }`}
            onClick={() => setSelectedVariant(variant)}
          >
            <div className="relative w-full h-24 md:h-32 rounded-md overflow-hidden">
              <Image
                src={variant.image || "/images/default-product.jpg"} // Fallback image
                alt={`${variant.color} - ${variant.size}`}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center text-sm text-gray-700">
              Size: {variant.size} | Color: {variant.color}
            </p>
            <p className="text-center text-green-600 text-sm font-semibold">
              ₦{variant.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Size and Color Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size:
          </label>
          <select
            name="size"
            value={selectedVariant?.size || ""}
            onChange={handleVariantChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            required
          >
            {variants
              .filter((variant) => variant.color === selectedVariant?.color)
              .map((variant) => (
                <option key={variant.variantId} value={variant.size}>
                  {variant.size}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color:
          </label>
          <select
            name="color"
            value={selectedVariant?.color || ""}
            onChange={handleVariantChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            required
          >
            {variants
              .filter((variant) => variant.size === selectedVariant?.size)
              .map((variant) => (
                <option key={variant.variantId} value={variant.color}>
                  {variant.color}
                </option>
              ))}
          </select>
        </div>
        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md shadow-lg flex items-center justify-center space-x-2 transition-all"
          >
            {isAddingToCart ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <FaShoppingCart />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={isAddingToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md shadow-lg flex items-center justify-center space-x-2 transition-all"
          >
            <FaArrowRight />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;
