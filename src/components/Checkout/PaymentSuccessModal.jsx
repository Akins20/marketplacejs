"use client";
import React from "react";
import { FiCheckCircle, FiTruck } from "react-icons/fi";
import { MdError } from "react-icons/md";

const PaymentSuccessModal = ({ order, onClose }) => {
  const {
    customerInfo,
    deliveryInfo,
    cart,
    transactionReference,
    totalAmount,
  } = order;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        {/* Success Icon and Thank You Message */}
        <div className="flex flex-col items-center">
          <FiCheckCircle className="text-green-500 text-6xl mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2 text-center">
            Thank You, {customerInfo.name}!
          </h2>
          <p className="text-gray-700 text-center mb-4">
            Your payment was successful and your order has been received. We
            will begin processing your order right away.
          </p>
        </div>

        {/* Order Information */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Order Summary
          </h3>
          <table className="w-full mt-2 text-left">
            <thead>
              <tr>
                <th className="py-2">Product</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 text-gray-600">
                    {item.title}
                  </td>
                  <td className="py-2 text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="py-2 text-gray-600">
                    ₦{item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Transaction Info */}
        <div className="bg-gray-50 rounded p-4 mb-4">
          <p className="text-gray-800">
            <strong>Transaction Reference:</strong> {transactionReference}
          </p>
          <p className="text-gray-800">
            <strong>Total Amount:</strong> ₦{totalAmount / 100}
          </p>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg mb-4">
          <FiTruck className="text-green-600 text-3xl" />
          <div>
            <p className="text-gray-700">
              <strong>Delivery Address:</strong> {deliveryInfo.address},{" "}
              {deliveryInfo.city}, {deliveryInfo.state}, {deliveryInfo.country}
            </p>
            <p className="text-gray-700">
              Delivery will begin soon, and you can expect your order within the
              next 7 days.
            </p>
          </div>
        </div>

        {/* Closing the Modal */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
