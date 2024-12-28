"use client";

const BillingInfo = () => {
  return (
    <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Billing Information</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="cardNumber">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="expiry">
            Expiry Date
          </label>
          <input
            type="text"
            id="expiry"
            className="w-full p-2 border rounded"
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="cvc">
            CVC
          </label>
          <input
            type="text"
            id="cvc"
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default BillingInfo;
