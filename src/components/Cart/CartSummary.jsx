const CartSummary = ({ filteredCart, handleCheckout }) => {
  const calculateTotalPrice = () =>
    filteredCart.reduce((total, item) => total + item.price * item.quantity, 0);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);

  return (
    <div className="mt-8 md:mt-0 md:w-1/3 w-full bg-white p-6 rounded-lg shadow-lg text-gray-800">
      <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
      <div className="text-lg space-y-2">
        <div className="flex justify-between">
          <p>Items:</p>
          <p>{filteredCart.length}</p>
        </div>
        <div className="flex justify-between font-bold">
          <p>Total:</p>
          <p>{formatPrice(calculateTotalPrice())}</p>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="mt-6 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
