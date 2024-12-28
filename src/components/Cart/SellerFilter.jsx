const SellerFilter = ({ selectedSellerId, setSelectedSellerId, cart }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor="sellerFilter"
        className="block text-lg font-semibold text-gray-700 mb-2"
      >
        Filter by Seller:
      </label>
      <select
        id="sellerFilter"
        value={selectedSellerId}
        onChange={(e) => setSelectedSellerId(e.target.value)}
        className="block w-full p-2 border rounded-md shadow-sm"
      >
        <option value="all">All Sellers</option>
        {Object.keys(cart).map((sellerId) => (
          <option key={sellerId} value={sellerId}>
            Seller {sellerId}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SellerFilter;
