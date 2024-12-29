import useCart from "@/hooks/useCart";

const CartSummary = ({ sellerId, handleCheckout }) => {
  const { filterCart, cart } = useCart();
  const filteredCart = filterCart(cart, sellerId);

  // Calculate the total price, considering quantity for both variant and non-variant products
  const calculateTotalPrice = () =>
    filteredCart.reduce(
      (total, item) => total + item.price * item.newQuantity,
      0
    );

  // Format price to currency
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);

  // Get total number of items, regardless of whether they are variants or not
  const totalItems = filteredCart.reduce(
    (total, item) => total + item.newQuantity,
    0
  );
  console.log("This is filtered: " + JSON.stringify(totalItems));

  return (
    <div className="mt-8 md:mt-0 md:w-1/3 w-full bg-white p-6 rounded-lg shadow-md text-gray-800 border border-gray-200">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-700">
        Cart Summary
      </h2>
      <div className="space-y-4 text-base md:text-lg">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Items:</p>
          <p className="font-semibold text-gray-700">{totalItems}</p>
        </div>
        <div className="flex justify-between items-center border-t pt-4">
          <p className="font-bold text-gray-700 text-lg">Total:</p>
          <p className="font-bold text-green-600 text-lg">
            {formatPrice(calculateTotalPrice())}
          </p>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="mt-8 w-full bg-green-600 text-white px-5 py-3 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 text-center font-medium text-lg"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
