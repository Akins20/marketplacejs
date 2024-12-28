"use client";

import { useState } from "react";
import Banner from "./Banner";
import PillSwitcher from "./PillSwitcher";
import CategoryButtonPicker from "./CategoryButtonPicker";
import ProductServiceViewer from "./ProductServiceViewer";
import { useProductData } from "@/hooks/useProductData";
import { useServiceData } from "@/hooks/useServiceData";
import { useProductCategoryData } from "@/hooks/useProductCategoryData";
import { fetchMessageRecipientAndMessages } from "@/utils/messageUtils";
import useProvideAuth from "../generalUtils/useAuth";
import ChatPanel from "../Messenger/messengerComponents/ChatPanel";
import Conversation from "../Messenger/messengerComponents/chatComponents/Conversation";
import SkeletonCategories from "../Shop/SkelotonCategories";

export default function Homepage() {
  const [selectedMode, setSelectedMode] = useState("products");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(4);
  const productsPerPage = 12;

  const { products, loading: loadingProducts } = useProductData();
  const { services, loading: loadingServices } = useServiceData();
  const { categories, loading: loadingCategories } = useProductCategoryData();
  const { user, admin } = useProvideAuth();
  const currentUser = user || admin;

  const [selectedService, setSelectedService] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleCategorySelect = (category) => setSelectedCategory(category);
  const handleToggleCategories = () =>
    setVisibleCategoriesCount((prevCount) =>
      prevCount >= categories.length ? 4 : prevCount + 2
    );

  const handleChatWithSeller = (service) => {
    setSelectedService(service);
    setLoadingMessages(true);
    fetchMessageRecipientAndMessages(
      service?.sellerId,
      currentUser,
      setRecipient,
      setMessages,
      setLoadingMessages
    );
  };

  return (
    <div className="mb-20 bg-white max-[760px]:pt-10">
      <Banner />

      {/* <PillSwitcher
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
      /> */}

      {loadingCategories ? (
        <SkeletonCategories />
      ) : (
        <CategoryButtonPicker
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          visibleCategoriesCount={visibleCategoriesCount}
          onToggleCategories={handleToggleCategories}
          selectedMode={selectedMode}
        />
      )}

      <ProductServiceViewer
        selectedMode={"products"}
        selectedCategory={selectedCategory}
        products={products}
        services={services}
        loadingProducts={loadingProducts}
        loadingServices={loadingServices}
        productsPerPage={productsPerPage}
        onChatWithSeller={handleChatWithSeller}
      />

      {/* <ChatPanel
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        isLoading={loadingMessages}
      >
        {recipient && (
          <Conversation
            recipient={recipient}
            currentUser={currentUser}
            messages={messages}
            isFromService={true}
          />
        )}
      </ChatPanel> */}
    </div>
  );
}
