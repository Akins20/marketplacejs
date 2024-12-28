const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="flex justify-center mb-6 space-x-4">
      <button
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          role === "buyer"
            ? "bg-green-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => setRole("buyer")}
      >
        Buyer
      </button>
      <button
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          role === "seller"
            ? "bg-green-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={() => setRole("seller")}
      >
        Seller
      </button>
    </div>
  );
};

export default RoleSelector;