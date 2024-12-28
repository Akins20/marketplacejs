import React from "react";
import { useCheckout } from "../generalUtils/checkoutContext";

const CustomerInfo = () => {
  const { customerInfo, handleCustomerInfoChange } = useCheckout();

  const fields = [
    { name: "name", type: "text", placeholder: "Name" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "phone", type: "tel", placeholder: "Phone" },
  ];

  return (
    <div className="mb-4 rounded shadow p-4">
      <h2 className="text-lg py-4 font-semibold">Customer Information</h2>
      {fields.map((field) => (
        <input
          key={field.name}
          type={field.type}
          placeholder={field.placeholder}
          name={field.name}
          value={customerInfo[field.name] || ""}
          onChange={handleCustomerInfoChange}
          className="border rounded-md p-2 w-full mb-2"
        />
      ))}
    </div>
  );
};

export default CustomerInfo;
