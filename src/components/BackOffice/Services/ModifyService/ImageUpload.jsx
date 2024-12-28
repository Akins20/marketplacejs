import React, { useState } from "react";

const ImageUpload = ({ images, setImages }) => {
  const [imageURL, setImageURL] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file");

  const handleImageChange = (e) => {
    if (images.length < 6) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setImages([...images, base64String]);
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      alert("You can only upload a maximum of 6 images.");
    }
  };

  const handleURLChange = (e) => {
    setImageURL(e.target.value);
  };

  const handleURLAdd = () => {
    if (imageURL && images.length < 6) {
      setImages([...images, imageURL]);
      setImageURL("");
    } else if (images.length >= 6) {
      alert("You can only upload a maximum of 6 images.");
    } else {
      alert("Please enter a valid image URL.");
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, imgIndex) => imgIndex !== index));
  };

  const handleUploadMethodChange = (e) => {
    setUploadMethod(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700">Upload Images</label>
      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="file"
            checked={uploadMethod === "file"}
            onChange={handleUploadMethodChange}
            className="mr-2"
          />
          File
        </label>
        <label>
          <input
            type="radio"
            value="url"
            checked={uploadMethod === "url"}
            onChange={handleUploadMethodChange}
            className="mr-2"
          />
          URL
        </label>
      </div>
      {uploadMethod === "file" ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
      ) : (
        <div className="flex mb-2">
          <input
            type="text"
            value={imageURL}
            onChange={handleURLChange}
            placeholder="Enter image URL"
            className="w-full p-2 border border-gray-300 rounded-l"
          />
          <button
            onClick={handleURLAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
          >
            Add
          </button>
        </div>
      )}
      <div className="mt-2">
        {images?.length > 0 && (
          <div className="flex flex-wrap">
            {images.map((image, index) => (
              <div key={index} className="m-2 relative">
                <img
                  src={image}
                  alt={`upload-${index}`}
                  className="h-20 w-20 object-cover rounded"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded p-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
