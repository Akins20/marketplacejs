import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase"; // Firestore setup
import DiscountForm from "./DiscountForm"; // Discount form component
import useSellerCheck from "@/hooks/useSellerCheck"; // Seller check hook
import PromoProductList from "./PromoProductList"; // Product list component
import Pagination from "@/components/Pagination"; // Pagination component

const PromotionManagement = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { isSeller } = useSellerCheck();

  const productsPerPage = 10; // Define how many products to display per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(firestore, "products");
        const productDocs = await getDocs(productsCollection);
        const productList = productDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Apply search and filter logic
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSeller = selectedSeller
        ? product.sellerEmail === selectedSeller
        : true;
      return matchesSearch && matchesSeller;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, selectedSeller, products]);

  const applyPromotion = async (promotion) => {
    if (selectedProducts.length === 0) {
      alert("No products selected!");
      return;
    }

    try {
      const updatePromises = selectedProducts.map((product) =>
        updateDoc(doc(firestore, "products", product.id), { promotion })
      );
      await Promise.all(updatePromises);
      alert("Promotion applied successfully!");
    } catch (error) {
      console.error("Error applying promotion:", error);
      alert("Failed to apply promotion.");
    }
  };

  const stopPromotion = async () => {
    if (selectedProducts.length === 0) {
      alert("No products selected to stop promotion!");
      return;
    }

    try {
      const updatePromises = selectedProducts.map((product) =>
        updateDoc(doc(firestore, "products", product.id), {
          promotion: null, // Remove the promotion from the product
        })
      );
      await Promise.all(updatePromises);
      alert("Promotions stopped successfully!");
    } catch (error) {
      console.error("Error stopping promotion:", error);
      alert("Failed to stop promotion.");
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedProducts(
        filteredProducts.slice(
          currentPage * productsPerPage - productsPerPage,
          currentPage * productsPerPage
        )
      );
    } else {
      setSelectedProducts([]);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="promotion-management-hub bg-inherit mb-10">
      <h2 className="text-xl font-semibold mb-4">
        {user.isAdmin ? "Manage All Promotions" : "Manage Your Promotions"}
      </h2>

      {/* Only show seller selection for admin */}
      {user.isAdmin && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Seller
          </label>
          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Sellers</option>
            {Array.from(
              new Set(products.map((product) => product.sellerEmail))
            ).map((sellerEmail) => (
              <option key={sellerEmail} value={sellerEmail}>
                {sellerEmail}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Search Filter */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        className="mb-4 p-2 border rounded-md w-full"
      />

      <DiscountForm
        onApply={applyPromotion}
        onStop={stopPromotion} // Add stop promotion handler
        selectedProducts={selectedProducts}
        isSeller={!user.isAdmin}
      />

      {/* List of Products */}
      <PromoProductList
        products={currentProducts}
        isSeller={isSeller(user)}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        onSelectAll={handleSelectAll}
        currentPage={currentPage}
        productsPerPage={productsPerPage}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PromotionManagement;
