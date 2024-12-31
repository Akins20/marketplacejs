"use client";

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <button
        type="button"
        onClick={() => setRole("buyer")}
        className={`px-4 py-2 rounded-md transition duration-300 ${
          role === "buyer"
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Buyer
      </button>
      <button
        type="button"
        onClick={() => setRole("seller")}
        className={`px-4 py-2 rounded-md transition duration-300 ${
          role === "seller"
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Seller
      </button>
    </div>
  );
};

export default RoleSelector;
