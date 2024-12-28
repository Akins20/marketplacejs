"use client";

import { useEffect, useState, useMemo } from "react";
import ServiceCard from "./ServiceCard";
import ServiceFilter from "./ServiceFilter";
import { useServiceData } from "@/hooks/useServiceData";
import useProvideAuth from "../generalUtils/useAuth";
import Conversation from "../Messenger/messengerComponents/chatComponents/Conversation";
import ChatPanel from "../Messenger/messengerComponents/ChatPanel";
import { fetchMessageRecipientAndMessages } from "@/utils/messageUtils";
import Loader from "../Loader";

const Services = ({ userServices }) => {
  const { services, loading: loadingServices } = useServiceData();
  const { user, admin } = useProvideAuth();
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const servicesPerPage = 20;
  const currentUser = user || admin;

  useEffect(() => {
    if (!userServices) {
      setAllServices(services);
      setFilteredServices(services);
    } else {
      setAllServices(userServices);
      setFilteredServices(userServices);
    }
  }, [services, userServices]);

  const handleFilter = (filtered) => {
    setFilteredServices(filtered);
    setCurrentPage(1);
  };

  const handleChatWithSeller = (service) => {
    setSelectedService(service);
    setLoadingMessages(true);

    fetchMessageRecipientAndMessages(
      service.sellerId,
      currentUser,
      setRecipient,
      setMessages,
      setLoadingMessages
    );
  };

  const displayedServices = filteredServices.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
  );

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  return (
    <div className="mx-auto py-10 px-4 lg:px-16 bg-white text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-8">Shop Services</h1>
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div className="md:w-1/4 w-full">
          <ServiceFilter allServices={allServices} onFilter={handleFilter} />
        </div>

        <div className="md:flex-grow w-full">
          {loadingServices ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-[520px]:mx-14">
              {displayedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  currentUser={currentUser}
                  onChatWithSeller={handleChatWithSeller}
                />
              ))}
            </div>
          )}

          <div className="flex justify-center mt-20">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-700 transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-2 text-white py-2 px-3 rounded-md ${
                  currentPage === index + 1
                    ? "bg-green-700"
                    : "bg-green-800 hover:bg-green-700"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-700 transition ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Reusable Sliding Panel */}
      <ChatPanel
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        isLoading={loadingMessages}
      >
        <Conversation
          recipient={recipient}
          currentUser={currentUser}
          messages={messages}
          isFromService={true}
        />
      </ChatPanel>
    </div>
  );
};

export default Services;
