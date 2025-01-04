import ProductDetails from "@/components/Shop/ProductDetails/ProductDetails";

const ProductPage = ({ params }) => {
  // Replace hyphens with spaces
  const { uniqueId } = params; // Unique ID from the URL
  const productId = params.productID.replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-white">
      <ProductDetails productId={productId} sellerId={uniqueId} />
      {/* Pass the modified productId with spaces */}
    </main>
  );
};

export default ProductPage;
