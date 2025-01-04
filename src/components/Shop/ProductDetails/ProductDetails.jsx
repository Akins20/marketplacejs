"use client";

import { useState, useEffect, Suspense, memo } from "react";
import dynamic from "next/dynamic";
import { fetchSingleProduct } from "../../generalUtils/fetchProducts.server";
import ProductImageGallery from "./ProductImageGallery";
import ProductVariants from "./ProductVariants";
import ProductDetailsInfo from "./ProductDetailsInfo";
import { FaStar, FaShoppingCart, FaArrowRight } from "react-icons/fa";
import AddedToCartModal from "./AddToCartModal";
import useCart from "@/hooks/useCart";
import { useRouter } from "next/navigation";

const Reviews = dynamic(() => import("../Reviews"), { suspense: true });

const ProductDetails = ({ productId, sellerId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchSingleProduct(productId, setProduct, setLoading);
  }, [productId]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (quantity < 1) return;
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const pickedVariant = product.isVariant
      ? { ...selectedVariant }
      : { color: product.color, size: product.size, price: product.price };

    const productData = {
      title: product.title,
      imageUrl: product.imageUrls[0],
      state: product.location?.state || "",
      address: product.location?.address || "",
      id: product.id,
      ...pickedVariant,
      sellerEmail: product.sellerEmail,
      newQuantity: quantity,
      quantity: product.quantity,
      sellerId: sellerId || product.sellerId,
      variantId: product.isVariant ? selectedVariant.variantId : "",
    };

    addToCart(productData);
    setIsAddingToCart(false);
    setIsModalOpen(true);
  };

  const handleBuyNow = async () => {
    if (quantity < 1) return;
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const pickedVariant = product.isVariant
      ? { ...selectedVariant }
      : { color: product.color, size: product.size, price: product.price };

    const productData = {
      title: product.title,
      imageUrl: product.imageUrls[0],
      state: product.location?.state || "",
      address: product.location?.address || "",
      id: product.id,
      ...pickedVariant,
      sellerEmail: product.sellerEmail,
      newQuantity: quantity,
      quantity: product.quantity,
      sellerId: sellerId || product.sellerId,
      variantId: product.isVariant ? selectedVariant.variantId : "",
    };

    addToCart(productData);
    setIsAddingToCart(false);
    router.push(`/${sellerId || product.sellerId}/checkout`); // Redirect to checkout
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
    <div className="mx-auto p-4 bg-gray-50 rounded-md shadow-md max-[720px]:pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ProductImageGallery
          imageUrls={product.imageUrls}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
        />

        {/* Product Details */}
        <div className="space-y-6">
          <ProductDetailsInfo
            product={product}
            selectedVariant={selectedVariant}
            quantity={quantity}
            handleQuantityChange={(e) => setQuantity(Number(e.target.value))}
            isAddingToCart={isAddingToCart}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
          />

          {/* Conditionally Render Variants */}
          {product.isVariant && (
            <ProductVariants
              variants={product.variants}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              handleVariantChange={(e) => {
                const { name, value } = e.target;
                const updatedVariant = { ...selectedVariant, [name]: value };
                const matchingVariant = product.variants.find(
                  (variant) =>
                    (name === "size"
                      ? variant.size === value
                      : variant.size === updatedVariant.size) &&
                    (name === "color"
                      ? variant.color === value
                      : variant.color === updatedVariant.color)
                );
                if (matchingVariant) setSelectedVariant(matchingVariant);
              }}
              isAddingToCart={isAddingToCart}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
            />
          )}
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

      {/* Added to Cart Modal */}
      <AddedToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGoToCart={() => router.push(`/${sellerId || product.sellerId}/cart`)}
      />
    </div>
  );
};

export default memo(ProductDetails);
