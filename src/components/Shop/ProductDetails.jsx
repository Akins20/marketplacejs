"use client";

import { useState, useEffect, Suspense, memo } from "react";
import Image from "next/image";
import useCart from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import dynamic from "next/dynamic";
import { fetchSingleProduct } from "../generalUtils/fetchProducts.server";

const Reviews = dynamic(() => import("./Reviews"), { suspense: true });

const ProductDetails = ({ productId, sellerId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchSingleProduct(productId, setProduct, setLoading);
  }, [productId]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // Set the first variant as the default selected variant
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setQuantity(value > 0 ? value : 1); // Ensure quantity is at least 1
  };

  const handleAddToCart = () => {
    if (quantity < 1) return; // Prevent adding invalid product or quantity
    const pickedVariant = product.isVariant
      ? { ...selectedVariant }
      : { color: product.color, size: product.size, price: product.price };
    console.log("Adding variant: " + JSON.stringify(pickedVariant));
    const productData = {
      title: product.title,
      imageUrl: product.imageUrls[0],
      state: product.location?.state || "",
      address: product.location?.address || "",
      id: product.id,
      ...pickedVariant, // Include variant details
      sellerEmail: product.sellerEmail,
      newQuantity: quantity,
      quantity: product.quantity,
      sellerId: sellerId || product.sellerId,
      variantId: product.isVariant ? selectedVariant.variantId : "", // Ensure variantId is passed to the cart
    };

    console.log("Product data: " + JSON.stringify(productData));
    addToCart(productData);

    router.push(`/${sellerId}/cart`);
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target; // name is 'size' or 'color'
    const updatedVariant = { ...selectedVariant, [name]: value };

    // Find the matching variant with the updated size and color
    const matchingVariant = product.variants.find(
      (variant) =>
        (name === "size"
          ? variant.size === value
          : variant.size === updatedVariant.size) &&
        (name === "color"
          ? variant.color === value
          : variant.color === updatedVariant.color)
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setQuantity(1); // Reset quantity to 1 when variant changes
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-96 w-full mb-4"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-300"></div>
          <div className="h-4 bg-gray-300 w-1/2"></div>
          <div className="h-4 bg-gray-300 w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-gray-600">No product found!</p>;
  }

  return (
    <div className="mx-auto p-6 bg-gray-50 rounded-md shadow-md max-[720px]:pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative flex">
          {/* Thumbnails */}
          <div className="w-1/5 flex flex-col space-y-4 justify-center items-start pl-4">
            {product.imageUrls.map((imageUrl, index) => (
              <div
                key={index}
                className={`cursor-pointer border-2 ${
                  index === currentImage
                    ? "border-green-500"
                    : "border-gray-200 hover:border-gray-400"
                } rounded-md`}
                onClick={() => setCurrentImage(index)}
              >
                <Image
                  src={imageUrl}
                  alt={`Thumbnail ${index}`}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              </div>
            ))}
          </div>
          <div className="w-4/5 flex justify-center items-center">
            <Image
              src={product.imageUrls[currentImage]}
              alt={product.title}
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Details Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {product.title}
          </h1>
          <div className="flex items-center space-x-3 mb-4">
            <FaStar className="text-yellow-500" />
            <p className="text-lg font-medium">
              {product.averageRating || 0}/5
            </p>
            <p className="text-gray-500">
              ({product.reviews?.length || 0} reviews)
            </p>
          </div>
          <p className="text-gray-900 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-green-600 mb-2">
            ₦
            {selectedVariant
              ? selectedVariant.price.toLocaleString()
              : product.price.toLocaleString()}
          </p>

          {/* All Variants Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {product.isVariant &&
              product.variants.map((variant) => (
                <div
                  key={variant.variantId}
                  className={`p-2 border-2 rounded-md cursor-pointer transition-transform duration-200 ${
                    selectedVariant?.variantId === variant.variantId
                      ? "border-green-500 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <Image
                    src={variant.image || product.imageUrls[0]}
                    alt={`${variant.color} - ${variant.size}`}
                    width={80}
                    height={80}
                    className="object-cover rounded-md w-16 h-16 md:w-20 md:h-20 mx-auto"
                  />
                  <p className="mt-2 text-center text-sm text-gray-700">
                    Size: {variant.size} | Color: {variant.color}
                  </p>
                  <p className="text-center text-green-600 text-sm">
                    ₦{variant.price.toLocaleString()}
                  </p>
                </div>
              ))}
          </div>

          {product.isVariant ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Size Selector */}
              <div>
                <label className="text-gray-500">Size:</label>
                <select
                  name="size"
                  value={selectedVariant?.size || ""}
                  onChange={handleVariantChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  {product.variants
                    .filter(
                      (variant) => variant.color === selectedVariant?.color
                    )
                    .map((variant) => (
                      <option key={variant.variantId} value={variant.size}>
                        {variant.size}
                      </option>
                    ))}
                </select>
              </div>

              {/* Color Selector */}
              <div>
                <label className="text-gray-500">Color:</label>
                <select
                  name="color"
                  value={selectedVariant?.color || ""}
                  onChange={handleVariantChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  {product.variants
                    .filter((variant) => variant.size === selectedVariant?.size)
                    .map((variant) => (
                      <option key={variant.variantId} value={variant.color}>
                        {variant.color}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              {product.size && (
                <p className="text-black">Size: {product.size}</p>
              )}
              {product.color && (
                <p className="text-black">Color: {product.color}</p>
              )}
            </div>
          )}

          {/* Stock Information */}
          <p className="text-gray-900">
            In Stock: {selectedVariant?.quantity || product.quantity || 0}
          </p>

          {/* Quantity Control */}
          <div className="flex items-center mt-6 mb-4">
            <label className="text-gray-800 mr-4">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={selectedVariant?.quantity || product.quantity} // Limit max quantity to available stock
              className="w-16 border border-gray-300 rounded-md text-center py-1"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md shadow-lg flex items-center justify-center text-lg space-x-2"
          >
            <FaShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <Suspense fallback={<p>Loading reviews...</p>}>
          <Reviews
            productId={product.id}
            existingReviews={product.reviews}
            rating={product.averageRating}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default memo(ProductDetails);
