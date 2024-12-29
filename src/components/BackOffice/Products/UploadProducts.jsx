"use client";
import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { createProduct } from "../Functions/ProductUtils";
import Image from "next/image";
import { fetchCategories } from "../Functions/CategoryUtils";
import { v4 as uuidV4 } from "uuid";
import { useRouter } from "next/navigation";

export default function UploadProducts({ user }) {
  const [product, setProduct] = useState({
    title: "",
    size: "",
    tags: "",
    category: "",
    description: "",
    location: {
      state: "",
      address: "",
    },
    gender: "",
    color: "",
    price: 0,
    quantity: 0,
    brand: "",
    imageUrls: [],
    variants: [], // Add variants to product state
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isVariant, setIsVariant] = useState(false); // Track if product has variants
  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const categoriesList = await fetchCategories();
      setCategories(categoriesList);
    };

    fetchCategoriesData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "price" || name === "wholesalePrice" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleVariantChange = (e, index) => {
    const { name, value } = e.target;
    const updatedVariants = [...product.variants];

    // Check if the variant already has an ID, if not, generate one
    if (!updatedVariants[index].variantId) {
      updatedVariants[index].variantId = uuidV4();
    }

    // Update the variant with the new value for the changed attribute
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]: value,
    };

    setProduct((prevProduct) => ({
      ...prevProduct,
      variants: updatedVariants,
    }));
  };

  const handleAddVariant = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      variants: [
        ...prevProduct.variants,
        { size: "", color: "", price: 0, quantity: 0 }, // Add empty variant object
      ],
    }));
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = [...product.variants];
    updatedVariants.splice(index, 1);
    setProduct((prevProduct) => ({
      ...prevProduct,
      variants: updatedVariants,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImageUrls = [];

      // Upload each selected image to Firebase Storage and collect URLs
      if (images.length > 0) {
        for (let image of images) {
          const imageRef = ref(storage, `products/${image.name}`);
          await uploadBytes(imageRef, image);
          const imageUrl = await getDownloadURL(imageRef);
          uploadedImageUrls.push(imageUrl);
        }
      }

      const productData = {
        ...product,
        imageUrls: uploadedImageUrls,
        sellerEmail: user.email,
      };

      if (isVariant) {
        // Handle multiple variants
        for (let variant of product.variants) {
          const variantData = { ...productData, ...variant, isVariant: true };
          await createProduct(variantData, user.uniqueId); // Save each variant
        }
      } else {
        // Handle single product type
        await createProduct(
          { ...productData, isVariant: false },
          user.uniqueId
        );
      }

      // Reset product state after successful upload
      setProduct({
        title: "",
        size: "",
        tags: "",
        category: "",
        description: "",
        location: { state: "", address: "" },
        gender: "",
        color: "",
        price: 0,
        quantity: 0,
        brand: "",
        imageUrls: [],
        variants: [], // Reset variants
      });

      alert("Product added successfully");
      router.push(`/${user.uniqueId}/shop`); // Redirect to products page
    } catch (error) {
      console.error("Error adding product: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4 text-center">Upload Products</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Info Fields */}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          {/* More input fields for size, tags, description, etc. */}
          <div>
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Tags(optional)</label>
            <input
              type="text"
              name="tags"
              value={product.tags}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Brand(optional)</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Product Location</label>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                name="state"
                value={product.location.state}
                onChange={(e) =>
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    location: {
                      ...prevProduct.location,
                      state: e.target.value, // Update state value here
                    },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter the state where the product is located..."
                title="This is to help with matching delivery providers with your location"
                required
              />
              <input
                type="text"
                name="address"
                value={product.location.address}
                onChange={(e) =>
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    location: {
                      ...prevProduct.location,
                      address: e.target.value, // Update address value here
                    },
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter the address of the product..."
                title="This is to help with matching delivery providers with your location"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={product.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Has Variants?</label>
            <select
              name="hasVariants"
              value={isVariant}
              onChange={(e) => setIsVariant(e.target.value === "true")}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {isVariant ? (
            <div>
              <h3 className="text-xl mb-4">Product Variants</h3>
              {product.variants.map((variant, index) => (
                <div key={index} className="space-y-2">
                  <div>
                    <label className="block text-gray-700">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={variant.quantity}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>

                  <div className="flex flex-row-reverse justify-between">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-white  bg-red-700 px-2 py-2 hover:text-gray-100"
                    >
                      Remove Variant
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddVariant}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Add Variant
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-gray-700">Size</label>
                <input
                  type="text"
                  name="size"
                  value={product.size}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Color</label>
                <input
                  type="text"
                  name="color"
                  value={product.color}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </>
          )}

          {/* Image Upload Section */}
          <div>
            <label className="block text-gray-700">Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.length > 0 &&
            images.map((image, index) => (
              <div key={index} className="relative w-40">
                <Image
                  src={URL.createObjectURL(image)}
                  layout="contained"
                  width={100}
                  height={100}
                  alt={`Preview ${index + 1}`}
                  className="object-cover w-full h-full rounded border border-gray-300"
                />
              </div>
            ))}
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 inline-block"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Upload Product"
          )}
        </button>
      </form>
    </div>
  );
}
