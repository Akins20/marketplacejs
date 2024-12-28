import { useState } from "react";

const DiscountForm = ({ onApply, onStop, selectedProducts, isSeller }) => {
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [maxDiscountedItems, setMaxDiscountedItems] = useState(0);
  const [discountType, setDiscountType] = useState("percentage"); // Default to percentage discount

  const handleApply = () => {
    if (discountType === "percentage" && discountPercentage <= 0) {
      alert("Please input a valid discount percentage.");
      return;
    }

    if (discountType === "amount" && discountAmount <= 0) {
      alert("Please input a valid discount amount.");
      return;
    }

    if (maxDiscountedItems <= 0) {
      alert("Please input a valid max discounted items.");
      return;
    }

    const promotion = {
      discountPercentage:
        discountType === "percentage" ? discountPercentage : 0,
      discountAmount: discountType === "amount" ? discountAmount : 0,
      maxDiscountedItems,
      discountType,
    };

    onApply(promotion);
  };

  const handleStopPromotion = () => {
    if (selectedProducts.length === 0) {
      alert("No products selected to stop promotion!");
      return;
    }
    onStop(); // Call stop promotion function
  };

  return (
    <div className="discount-form mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {isSeller ? "Apply Promotion to Your Products" : "Apply Promotion"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Discount Type */}
        <div className="col-span-2">
          <label className="block text-sm font-medium">Discount Type</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="percentage">Percentage</option>
            <option value="amount">Fixed Amount</option>
          </select>
        </div>

        {/* Discount Percentage */}
        {discountType === "percentage" && (
          <div>
            <label className="block text-sm font-medium">
              Discount Percentage
            </label>
            <input
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}

        {/* Discount Amount */}
        {discountType === "amount" && (
          <div>
            <label className="block text-sm font-medium">Discount Amount</label>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}

        {/* Max Discounted Items */}
        <div>
          <label className="block text-sm font-medium">
            Max Discounted Items
          </label>
          <input
            type="number"
            value={maxDiscountedItems}
            onChange={(e) => setMaxDiscountedItems(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={handleApply}
          disabled={selectedProducts.length === 0}
        >
          Apply Promotion to {selectedProducts.length} Selected Products
        </button>

        {/* Stop Promotion Button */}
        <button
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={handleStopPromotion}
          disabled={selectedProducts.length === 0}
        >
          Stop Promotion
        </button>
      </div>
    </div>
  );
};

export default DiscountForm;
