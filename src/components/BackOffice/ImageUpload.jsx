import React from "react";

const ImageUpload = ({ setImages }) => {
  const handleFileChange = (e) => {
    const files = e.target.files;
    setImages(files); // Send the files back to the parent component
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-semibold mb-2">
        Upload Images
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

export default ImageUpload;
