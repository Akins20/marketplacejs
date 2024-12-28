import Image from "next/image";
import Link from "next/link";
import {
  FaUserCircle,
  FaShoppingCart,
  FaClipboardList,
  FaThumbsUp,
} from "react-icons/fa";

const UserDisplay = ({ userInfo }) => {
  return (
    <section className="bg-white mt-20 shadow-lg rounded-lg p-8 mb-10 max-w-4xl mx-auto">
      <div className="flex items-center space-x-6 mb-6">
        {/* User Image */}
        {userInfo.userImage || userInfo.adminImage ? (
          <Image
            src={userInfo.userImage || userInfo.adminImage}
            layout="intrinsic"
            width={150}
            height={150}
            alt="User"
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-300"
          />
        ) : (
          <FaUserCircle className="text-8xl text-gray-400" />
        )}

        {/* User Details */}
        <div className="flex-grow">
          <h2 className="text-3xl font-bold text-black">
            {userInfo.firstName} {userInfo.lastName}
          </h2>
          <p className="text-gray-500">{userInfo.email}</p>
          <p className="text-gray-500">{userInfo.address}</p>
        </div>
      </div>

      <Link href={`/${userInfo.uniqueId}/shop`} className="text-white bg-green-600 px-4 py-2 rounded my-4">
        View Shop
      </Link>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-10">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <FaClipboardList className="text-blue-600 text-4xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
          <p className="text-xl font-bold text-gray-900">
            {userInfo.orders?.length || 0}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <FaThumbsUp className="text-green-600 text-4xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">Reviews</h3>
          <p className="text-xl font-bold text-gray-900">
            {userInfo.reviews?.length || 0}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <FaShoppingCart className="text-yellow-600 text-4xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">Items in Cart</h3>
          <p className="text-xl font-bold text-gray-900">
            {userInfo.cart?.length || 0}
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserDisplay;
