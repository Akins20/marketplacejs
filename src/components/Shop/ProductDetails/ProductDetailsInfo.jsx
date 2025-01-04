import { FaStar, FaShoppingCart, FaArrowRight } from "react-icons/fa";

const ProductDetailsInfo = ({
  product,
  selectedVariant,
  quantity,
  handleQuantityChange,
  isAddingToCart,
  handleAddToCart,
  handleBuyNow, // New prop for Buy Now functionality
}) => {
  return (
    <div className="space-y-6">
      {/* Product Title */}
      <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>

      {/* Rating and Reviews */}
      <div className="flex items-center space-x-3">
        <FaStar className="text-yellow-500" />
        <p className="text-lg font-medium">{product.averageRating || 0}/5</p>
        <p className="text-gray-500">
          ({product.reviews?.length || 0} reviews)
        </p>
      </div>

      {/* Product Description */}
      <p className="text-gray-700">{product.description}</p>

      {/* Price */}
      <p className="text-2xl font-semibold text-green-600">
        ₦
        {selectedVariant
          ? selectedVariant.price.toLocaleString()
          : product.price.toLocaleString()}
      </p>

      {/* Stock Information */}
      <p className="text-gray-700">
        In Stock: {selectedVariant?.quantity || product.quantity || 0}
      </p>

      {/* Quantity Control */}
      <div className="flex items-center">
        <label className="text-gray-800 mr-4">Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          max={selectedVariant?.quantity || product.quantity}
          className="w-16 border border-gray-300 rounded-md text-center py-1"
        />
      </div>
      <div className="mt-6">
        {product.size && (
          <p className="text-gray-700">
            <span className="font-semibold">Size:</span> {product.size}
          </p>
        )}
        {product.color && (
          <p className="text-gray-700">
            <span className="font-semibold">Color:</span> {product.color}
          </p>
        )}
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
  );
};

export default ProductDetailsInfo;
