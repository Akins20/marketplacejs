"use client";

import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import UploadProducts from "./Products/UploadProducts";
import ManageCustomers from "./ManageCustomer";
import ProductList from "./Products/ProductList";
import UploadCategories from "./UploadCategory";
import ViewCategories from "./ViewCategories";
import OrderManagement from "./Orders/OrderManagement";
import OrderNotification from "./Orders/OrderNotification";
import AdminDisplay from "./Info/AdminDisplay";
import AdminInfo from "./Info/AdminView";
import PromotionManagement from "./Management/PromotionManagement";


const sections = {
  "upload-products": UploadProducts,
  "add-categories": UploadCategories,
  "view-categories": ViewCategories,
  "product-list": ProductList,
  "manage-customers": ManageCustomers,
  "view-orders": OrderManagement,
  // "order-notification": OrderNotification,
  "admin-display": AdminDisplay,
  "admin-info": AdminInfo,
  "manage-promotions": PromotionManagement,
};

export default function BackOfficeLayout({ user }) {
  const [selectedSection, setSelectedSection] = useState("admin-display");

  // Store and restore the last selected section
  useEffect(() => {
    const lastSelectedSection = localStorage.getItem("admin-section");
    if (lastSelectedSection) {
      setSelectedSection(lastSelectedSection);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-section", selectedSection);
  }, [selectedSection]);

  const SectionComponent = sections[selectedSection];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white text-gray-800">
      {/* Sidebar Component */}
      <Sidebar setSelectedSection={setSelectedSection} user={user} />
      <main className="flex-grow p-4 bg-white text-gray-800">
        <div className="bg-inherit text-gray-800">
          {/* Render the appropriate section based on the selected item */}
          <SectionComponent user={user} adminInfo={user} />
        </div>
      </main>
    </div>
  );
}
