import React, { useEffect, useState } from "react";
import { firestore, storage } from "@/firebase"; // Adjust the path based on your project structure
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage for image upload
import Image from "next/image";
import { FiFrown, FiEdit, FiTrash } from "react-icons/fi"; // Importing icons from react-icons

export default function ViewCategories({ user }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [newImageFile, setNewImageFile] = useState(null);

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(firestore, "categories");
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setNotification({ message: "Error fetching categories", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open the modal and populate with selected category data
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  // Handle category update with image upload if there's a new image
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const { id, title } = selectedCategory;

    try {
      // If a new image is uploaded, handle the file upload
      let imageUrl = selectedCategory.imageUrl;
      if (newImageFile) {
        const imageRef = ref(storage, `categories/${newImageFile.name}`);
        await uploadBytes(imageRef, newImageFile);
        imageUrl = await getDownloadURL(imageRef); // Get the uploaded image URL
      }

      // Update Firestore with the new image URL or the old one
      const categoryRef = doc(firestore, "categories", id);
      await updateDoc(categoryRef, { title, imageUrl });
      setNotification({
        message: "Category updated successfully",
        type: "success",
      });
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      setNotification({ message: "Error updating category", type: "error" });
    } finally {
      setShowModal(false);
      setNewImageFile(null); // Reset the file input
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (id) => {
    try {
      await deleteDoc(doc(firestore, "categories", id));
      setNotification({
        message: "Category deleted successfully",
        type: "success",
      });
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error("Error deleting category:", error);
      setNotification({ message: "Error deleting category", type: "error" });
    }
  };

  if (loading) {
    return <p>Loading categories...</p>; // Simple loading state
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
        <FiFrown className="text-4xl text-gray-500 mb-4" /> {/* Frown icon */}
        <p className="text-lg font-semibold text-gray-600">
          You have no categories yet!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Categories</h2>

      {/* Notification Bar */}
      {notification.message && (
        <div
          className={`p-4 mb-4 text-white rounded-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className=" bg-white text-black dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            {/* Image */}
            <div className="relative h-40 w-full rounded-t-lg overflow-hidden">
              <Image
                src={category.imageUrl}
                alt={category.title}
                layout="fill"
                className="object-cover"
              />
            </div>
            {/* Title */}
            <span className="text-center font-medium mt-2">
              {category.title}
            </span>

            {/* Buttons */}
            <div className="flex justify-between w-full mt-2 p-4">
              {/* Edit Button */}
              <button
                onClick={() => handleEdit(category)}
                className="bg-blue-500 text-white p-2 rounded flex items-center space-x-1 hover:bg-blue-600"
              >
                <FiEdit /> <span>Edit</span>
              </button>

              {/* Delete Button */}
              {user.isAdmin ? (
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-500 text-white p-2 rounded flex items-center space-x-1 hover:bg-red-600"
                >
                  <FiTrash /> <span>Delete</span>
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
            <form onSubmit={handleUpdateCategory}>
              <label className="block mb-2">
                Title:
                <input
                  type="text"
                  value={selectedCategory.title}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      title: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                  required
                />
              </label>

              {/* Display Existing Image */}
              <div className="mb-4">
                <p className="mb-2">Current Image:</p>
                <Image
                  src={selectedCategory.imageUrl}
                  alt={selectedCategory.title}
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>

              {/* Image Upload */}
              <label className="block mb-4">
                Replace Image:
                <input
                  type="file"
                  onChange={(e) => setNewImageFile(e.target.files[0])}
                  className="border p-2 rounded w-full"
                  accept="image/*"
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
