import Image from "next/image";
import { useState } from "react";
import EditProductModal from "./OfficeProductModal";

const ProductCard = ({ product, onEdit, onDelete, user }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete(product.id); // Assuming product has an id to identify it
  };

  return (
    <div className="border mb-4 rounded-lg shadow-lg">
      <div className="flex flex-col items-center">
        <div className="p-2">
          <Image
            src={product.imageUrls[0]}
            layout="contained"
            width={300}
            height={300}
            alt={product.title}
            className="w-40 h-40 object-cover mb-4"
          />
        </div>
        <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
        <p className="text-sm text-gray-500 mb-2">Tags: {product.tags}</p>
        <p className="text-lg font-bold mb-2 text-green-500">
          ₦{product.price}
        </p>

        <div className="flex space-x-2 w-full mt-2 p-2">
          <button
            onClick={handleEditClick}
            className="bg-yellow-500 text-white rounded p-2 flex-1"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 text-white rounded p-2 flex-1"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal for editing */}
      {isEditing && (
        <EditProductModal
          product={product}
          onClose={handleCloseModal}
          onEdit={onEdit}
          user={user}
        />
      )}
    </div>
  );
};

export default ProductCard;
