import { useState, useEffect } from "react";
import { arrayRemove, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import ProductCard from "@/components/BackOffice/Products/ProductCard";
import { useProductData } from "@/hooks/useProductData";

export default function ProductList({ user }) {
  const { products: allProducts } = useProductData();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading state
      setError(null); // Clear any previous errors

      try {
        // Filter products by the seller email if the user is not an admin
        const filteredProducts = user.isAdmin
          ? allProducts
          : allProducts.filter((product) => product.sellerEmail === user.email);

        setProducts(filteredProducts);
      } catch (error) {
        setError("Error fetching products. Please try again.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Remove loading state after fetch
      }
    };

    fetchProducts();
  }, [allProducts, user]);

  // Handle product updates
  const handleEditProduct = async (updatedProduct) => {
    try {
      const productRef = doc(firestore, "products", updatedProduct.id);
      await updateDoc(productRef, updatedProduct);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );

      alert("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Error updating product. Please try again.");
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      const productRef = doc(firestore, "products", productId);

      // Delete the product document from Firestore
      await deleteDoc(productRef);

      // Delete the productId from the users document in products array
      const sellerDocRef = doc(firestore, "sellers", user.id); // Adjust the collection to "admins" if necessary
      await updateDoc(sellerDocRef, {
        products: arrayRemove(productId),
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      alert("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Error deleting product. Please try again.");
    }
  };

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl mb-4">Product List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {/* Loading and Error States */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Total Products Count */}
          <p className="mb-4">Total Products: {filteredProducts.length}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct} // Pass the delete function to ProductCard
                user={user}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
