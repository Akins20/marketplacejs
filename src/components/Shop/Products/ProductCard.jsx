"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaShoppingCart, FaUserTag } from "react-icons/fa";
import useCart from "@/hooks/useCart";
import useSellerCheck from "@/hooks/useSellerCheck"; // Import the seller check hook
import { useRouter } from "next/navigation";
import { renderStars } from "@/components/generalUtils/generalFunctions";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isProductSoldBySeller } = useSellerCheck(); // Hook to check if the product is sold by a verified seller
  const [isAdding, setIsAdding] = useState(false); // Loading state for the cart button

  // Default quantity if not provided in the product object
  const quantity = product.quantity || 1;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const discountPercentage = useMemo(() => {
    if (!product.wholesalePrice || product.wholesalePrice <= 0) return 0;
    return ((product.price - product.wholesalePrice) / product.price) * 100;
  }, [product.price, product.wholesalePrice]);

  const handleAddToCart = async () => {
    setIsAdding(true); // Start loading

    try {
      // Add to cart with proper structure
      await addToCart({
        ...product,
        quantity, // Ensure the quantity is correctly passed
        sellerId: product.sellerId, // Seller ID is necessary for grouping
      });

      // Optionally redirect after successful add
      router.push("/cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false); // Stop loading
    }
  };

  const formatTitle = (title) => title.trim().replace(/\s+/g, "-");

  const formattedTitle = formatTitle(product.title);

  return (
    <div className="w-64 bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-transform hover:scale-105 relative">
      <div className="relative h-60">
        {/* Product Image */}
        <Image
          src={product.imageUrls[0]}
          layout="fill"
          alt={product.title}
          className="object-cover"
          loading="lazy" // Lazy load images
        />

        {/* Seller Badge */}
        {isProductSoldBySeller(product) ? (
          <Link
            href={`/${product.sellerId}`}
            prefetch={true}
            target="blank"
            className="absolute z-20 top-2 left-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1"
          >
            <FaUserTag />
            <span>Verified Seller</span>
          </Link>
        ) : (
          <Link
            href={`/${product.sellerId}`}
            prefetch={true}
            target="blank"
            className="absolute z-20 top-2 left-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1"
          >
            <FaUserTag />
            <span>Unverified Seller</span>
          </Link>
        )}

        {/* View Details Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
          <Link
            href={`/${product.sellerId}/shop/${formattedTitle}`}
            prefetch={true}
            aria-label={`View details of ${product.title}`}
          >
            <FaEye size={30} className="text-white" />
          </Link>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-light text-gray-600">
            {product.tags.split(",")[0]}
          </p>
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {Math.round(discountPercentage)}% Off
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold mb-2">{product.title}</h2>
        <div className="mb-2">{renderStars(product)}</div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.wholesalePrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.wholesalePrice)}
              </span>
            )}
          </div>
          <button
            className={`${
              isAdding ? "bg-gray-400" : "bg-green-800"
            } text-white p-2 rounded-full transition-transform hover:scale-105`}
            onClick={handleAddToCart}
            disabled={isAdding}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdding ? "Adding..." : <FaShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
