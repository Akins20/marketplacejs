import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

const UserCart = ({ cartItems }) => {
  return (
    <section className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        <FaShoppingCart className="inline mr-2 text-green-600" />
        Your Cart
      </h2>
      {cartItems.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartItems.map((item) => (
            <li key={item.id} className="border-b pb-4">
              {/* Thumbnail Image */}
              <div className="mb-2">
                <Image
                  src={item.imageUrls[0]}
                  alt={item.title}
                  layout="responsive"
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-md"
                />
              </div>

              <div className="flex-grow">
                <Link
                  href={`/shop/${item.id.toLowerCase().replace(/\s+/g, "-")}`}
                  prefetch={true}
                  className="font-medium text-blue-600 no-underline hover:no-underline"
                >
                  <span className="font-bold text-lg">{item.title}</span>
                </Link>
                <div className="text-gray-700">
                  Quantity: <span className="font-bold">{item.quantity}</span>
                </div>
                <div className="text-green-600">
                  ₦{item.price * item.quantity}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}
    </section>
  );
};

export default UserCart;
