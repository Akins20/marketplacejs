import Image from "next/image";
import React from "react";

const ImageUpload = ({ images, setImages }) => {
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + images.length > 6) {
      alert("You can only upload a maximum of 6 images.");
      return;
    }

    const newImages = [...images, ...selectedFiles];
    setImages(newImages); // Update images state with new files
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages); // Update images state after removing
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-semibold mb-2">
        Upload Images (Max: 6)
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {images.length > 0 &&
          images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={URL.createObjectURL(image)}
                alt={`upload-${index}`}
                width={100}
                height={100}
                layout="contained"
                className="h-20 w-20 object-cover rounded"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full text-xs"
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageUpload;
