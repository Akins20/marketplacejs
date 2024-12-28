import React from "react";
import { useCheckout } from "../generalUtils/checkoutContext";

const DeliveryInfo = () => {
  const { deliveryInfo, handleDeliveryInfoChange } = useCheckout();

  const fields = [
    { name: "address", type: "text", placeholder: "Address" },
    { name: "city", type: "text", placeholder: "City" },
    { name: "state", type: "text", placeholder: "State" },
    { name: "postalCode", type: "text", placeholder: "Postal Code" },
  ];

  return (
    <div className="mb-4 rounded shadow p-4">
      <h2 className="text-lg py-4 font-semibold">Delivery Information</h2>
      {fields.map((field) => (
        <input
          key={field.name}
          type={field.type}
          placeholder={field.placeholder}
          name={field.name}
          value={deliveryInfo[field.name] || ""}
          onChange={handleDeliveryInfoChange}
          className="border rounded-md p-2 w-full mb-2"
        />
      ))}
    </div>
  );
};

export default DeliveryInfo;
