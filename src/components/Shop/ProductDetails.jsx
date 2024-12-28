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
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchSingleProduct(productId, setProduct, setLoading);
  }, [productId]);

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setQuantity(value > 0 ? value : 1); // Ensure quantity is at least 1
  };

  const handleAddToCart = () => {
    if (!product || quantity < 1) return; // Prevent adding invalid product or quantity

    addToCart({ ...product, quantity, sellerId: sellerId || product.sellerId });
    router.push(`/${sellerId}/cart`);
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
            <p className="text-lg font-medium">{product.averageRating || 0}/5</p>
            <p className="text-gray-500">
              ({product.reviews?.length || 0} reviews)
            </p>
          </div>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-green-600 mb-2">
            ₦{product.price.toLocaleString()}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-gray-500">Size: {product.size}</p>
            <p className="text-gray-500">Color: {product.color}</p>
            <p className="text-gray-500">Brand: {product.brand}</p>
            <p className="text-gray-500">
              Availability: {product.availability}
            </p>
          </div>

          {/* Quantity Control */}
          <div className="flex items-center mt-6 mb-4">
            <label className="text-gray-800 mr-4">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
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
