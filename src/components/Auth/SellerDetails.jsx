import React from "react";

const SellerDetails = ({ sellerDetails, setSellerDetails, banks }) => {
  const handleChange = (e) => {
    console.log("THis is bank code: " + sellerDetails.bankCode);
    setSellerDetails({ ...sellerDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg mx-auto">
      {/* <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
        Seller Information
      </h2> */}
      <form className="space-y-6">
        <input
          type="text"
          name="businessName"
          placeholder="Business Name"
          value={sellerDetails.businessName}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
          required
        />
        <input
          type="text"
          name="accountNumber"
          placeholder="Bank Account Number"
          value={sellerDetails.accountNumber}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
          required
        />
        <select
          name="bankCode"
          value={sellerDetails.bankCode}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
          required
        >
          <option value="" disabled>
            Select Bank
          </option>
          {banks.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default SellerDetails;
