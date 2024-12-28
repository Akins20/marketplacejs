"use client";

import { useEffect, useState } from "react";
import { firestore } from "@/firebase"; // Adjust the import based on your Firebase setup
import { collection, getDocs } from "firebase/firestore";

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users")); // Replace "users" with your collection name
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>; // Replace with your Loader component if you want
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Manage Customers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="border rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">{customer.username}</h2>{" "}
              {/* Display username */}
              <p className="text-gray-600">Email: {customer.email}</p>{" "}
              {/* Display email */}
              {/* Add more fields as necessary */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
