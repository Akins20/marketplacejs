import CheckoutPage from "@/components/Checkout/Checkout";

const Checkout = ({ params }) => {
  const { uniqueId } = params || ""; // Unique ID from the URL

  return (
    <main className="min-h-screen bg-white">
      <CheckoutPage sellerId={uniqueId} />
    </main>
  );
};

export default Checkout;
