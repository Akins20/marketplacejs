"use client";
import { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/firebase";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4 from uuid package

export default function UploadCategories() {
  const [category, setCategory] = useState({
    title: "",
    imageUrl: "",
  });
  const [image, setImage] = useState(null); // State to hold category image
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]); // Set single image file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrl = "";

      // Upload image to Firebase Storage and get its URL
      if (image) {
        const imageRef = ref(storage, `categories/${image.name}`);
        await uploadBytes(imageRef, image);
        uploadedImageUrl = await getDownloadURL(imageRef);
      }

      // Generate a unique ID for each category using uuidv4
      const uniqueId = uuidv4();

      const categoryData = {
        ...category,
        id: uniqueId,
        imageUrl: uploadedImageUrl,
      };

      // Save category using the unique ID
      await setDoc(doc(firestore, "categories", uniqueId), categoryData);
      alert("Category added successfully");
    } catch (error) {
      console.error("Error adding category: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Upload Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-700">Category Title</label>
            <input
              type="text"
              name="title"
              value={category.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Category Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
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
            "Add Category"
          )}
        </button>
      </form>
    </div>
  );
}
