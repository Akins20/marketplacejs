import PromotionInfo from "./PromotionInfo";

const PromoProductList = ({
  uniqueId,
  products,
  isSeller,
  selectedProducts,
  setSelectedProducts,
  onSelectAll,
}) => {
  const handleProductSelection = (product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(product)
        ? prevSelected.filter((p) => p.id !== product.id)
        : [...prevSelected, product]
    );
  };
  const updatedProducts = products.filter((p) => p.sellerId === uniqueId);

  const isSelectedAll = selectedProducts.length === updatedProducts.length;

  return (
    <div className="product-list">
      <h3 className="text-lg font-semibold mb-4">Products</h3>

      {/* Select All Option */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isSelectedAll}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="form-checkbox h-5 w-5 mr-2"
        />
        <span>Select All</span>
      </div>

      <ul className="space-y-4">
        {updatedProducts.map((product) => (
          <li key={product.id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold">{product.title}</h4>
                <p className="text-gray-600">Price: ₦{product.price}</p>
                <PromotionInfo promotion={product.promotion} />
              </div>

              {/* Select Product */}
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product)}
                  onChange={() => handleProductSelection(product)}
                  className="form-checkbox h-5 w-5"
                />
                {isSeller && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleProductSelection(product)}
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromoProductList;
