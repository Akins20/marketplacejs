import {
  FaUserTag,
  FaProductHunt,
  FaShoppingCart,
  FaDollarSign,
} from "react-icons/fa";
import useSellerCheck from "@/hooks/useSellerCheck";
import Image from "next/image";
import Link from "next/link";

const AdminDisplay = ({ adminInfo }) => {
  const { isSeller } = useSellerCheck();

  return (
    <section className="bg-white shadow-md rounded-md p-6 mb-10 max-w-4xl mx-auto">
      <div className="flex items-center">
        {/* Admin Profile Picture */}
        {adminInfo.adminImage ? (
          <Image
            src={adminInfo.adminImage}
            layout="intrinsic"
            width={100}
            height={100}
            alt="Admin"
            className="w-24 h-24 rounded-full object-cover mr-6 border-4 border-gray-300"
          />
        ) : (
          <FaUserTag className="text-7xl text-gray-500 mr-6" />
        )}

        {/* Admin Basic Info */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {adminInfo.firstName} {adminInfo.lastName}
          </h2>
          <p className="text-gray-600">{adminInfo.email}</p>
          <p className="text-gray-600">{adminInfo.address}</p>

          {/* Display Seller Badge */}
          {isSeller(adminInfo) ? (
            <div className="mt-3 flex items-center">
              <FaUserTag className="text-green-500 mr-2" />
              <span className="text-sm text-green-500">Verified Seller</span>
            </div>
          ) : (
            <div className="mt-3 flex items-center">
              <FaUserTag className="text-red-500 mr-2" />
              <span className="text-sm text-red-500">Unverified Seller</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-evenly mt-6">
        <Link
          href={`/${adminInfo.uniqueId}/shop`}
          className="text-white bg-gray-700 px-2 py-2 rounded my-4"
        >
          View Shop
        </Link>

        {/* <Link
          href={`/${adminInfo.uniqueId}/services`}
          className="text-white bg-gray-700 px-2 py-2 rounded my-4"
        >
          View Services
        </Link> */}
      </div>

      {/* Admin Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Listed */}
        <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center space-x-4">
          <FaProductHunt className="text-3xl text-green-600" />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              Products Listed
            </h4>
            <p className="text-gray-500">{adminInfo.products?.length || 0}</p>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center space-x-4">
          <FaShoppingCart className="text-3xl text-blue-600" />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Total Sales</h4>
            <p className="text-gray-500">{adminInfo.orders?.length || 0}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center space-x-4">
          <FaDollarSign className="text-3xl text-yellow-600" />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              Total Revenue
            </h4>
            <p className="text-gray-500">
              ₦
              {adminInfo.totalRevenue
                ? adminInfo.totalRevenue?.toLocaleString()
                : "0.00"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDisplay;
