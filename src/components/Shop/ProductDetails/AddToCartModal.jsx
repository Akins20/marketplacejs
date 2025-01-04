import { createPortal } from "react-dom";
import { FaCheckCircle } from "react-icons/fa";

const AddedToCartModal = ({ isOpen, onClose, onGoToCart }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Added to Cart!</h2>
        <p className="text-gray-600 mb-6">
          Your item has been successfully added to your cart.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Continue
          </button>
          <button
            onClick={onGoToCart}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddedToCartModal;
