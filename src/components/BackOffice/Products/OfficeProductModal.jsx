import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";

const EditProductModal = ({ product, onClose, onEdit, user }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  // Handle uploading new images
  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  // Handle removing an existing image from the array
  const handleRemoveImage = (index) => {
    const updatedImages = [...editedProduct.imageUrls];
    updatedImages.splice(index, 1); // Remove the selected image by index
    setEditedProduct({
      ...editedProduct,
      imageUrls: updatedImages,
    });
  };

  // Handle saving product changes
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    let updatedImageUrls = [...editedProduct.imageUrls]; // Copy existing URLs

    // Upload new images and add their URLs to the array
    if (newImages.length > 0) {
      for (let image of newImages) {
        const imageRef = ref(storage, `products/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        updatedImageUrls.push(imageUrl);
      }
    }

    const updatedProduct = {
      ...editedProduct,
      imageUrls: updatedImageUrls, // Use the updated image URLs array
      sellerEmail: user.email
    };

    try {
      await setDoc(
        doc(firestore, "products", product.id), // Use title as document ID
        updatedProduct
      );
      onEdit(updatedProduct); // Call parent function to update the product
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error updating product: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 h-2/3 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
          {/* Form Fields */}
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={editedProduct.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Size</label>
            <input
              type="text"
              name="size"
              value={editedProduct.size}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Tags</label>
            <input
              type="text"
              name="tags"
              value={editedProduct.tags}
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
              value={editedProduct.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Wholesale Price</label>
            <input
              type="number"
              name="wholesalePrice"
              value={editedProduct.wholesalePrice}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Color</label>
            <input
              type="text"
              name="color"
              value={editedProduct.color}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Gender</label>
            <input
              type="text"
              name="gender"
              value={editedProduct.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={editedProduct.brand}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Sponsored By</label>
            <input
              type="text"
              name="sponsoredBy"
              value={editedProduct.sponsoredBy}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={editedProduct.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-gray-700">Availability</label>
            <select
              name="availability"
              value={editedProduct.availability}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          {/* Display existing images */}
          <div className="col-span-2">
            <label className="block text-gray-700">Existing Images</label>
            <div className="flex space-x-4">
              {editedProduct.imageUrls?.map((url, index) => (
                <div key={index} className="relative">
                  <Image
                    src={url}
                    layout="contained"
                    width={100}
                    height={100}
                    alt="Product Image"
                    className="w-20 h-20"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload new images */}
          <div className="col-span-2">
            <label className="block text-gray-700">Add New Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Save Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
