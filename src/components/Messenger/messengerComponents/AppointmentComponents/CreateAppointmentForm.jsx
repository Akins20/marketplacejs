import React, { useState, useEffect } from "react";
import { push, ref, set, serverTimestamp } from "firebase/database";
import { db, firestore } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function CreateAppointmentForm({ recipient, currentUser, onClose }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [appointmentType, setAppointmentType] = useState("active"); // "active" or "scheduled"
  const userEmail = currentUser.email;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(firestore, "services");
        const q = query(
          servicesCollection,
          where("adminEmail", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);
        const userServices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(userServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    if (userEmail) {
      fetchServices();
    }
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      service: selectedService,
      price,
      location,
      duration,
      customer: recipient.username,
      provider: currentUser.username,
      providerEmail: currentUser.email,
      customerEmail: recipient.email,
      startTime: appointmentType === "active" ? serverTimestamp() : null,
      status: appointmentType,
    };

    const newAppointmentRef = push(ref(db, `${appointmentType}Appointments`));
    await set(newAppointmentRef, appointmentData);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
          Create Appointment
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Service
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.serviceName}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Duration (in hours)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Appointment Type
            </label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            >
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {appointmentType === "active" ? "Start" : "Schedule"} Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAppointmentForm;
