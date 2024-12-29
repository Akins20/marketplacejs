"use client";

import Link from "next/link";
import {
  FaHome,
  FaShoppingBag,
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaSignOutAlt,
  FaLockOpen,
} from "react-icons/fa";
import useProvideAuth from "../generalUtils/useAuth";
import useCart from "@/hooks/useCart";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function DesktopNavbar({ toggleSearch }) {
  const { user, admin } = useProvideAuth();
  const { cart } = useCart();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Calculate total cart count
  const cartCount = Object.values(cart).reduce((total, sellerItems) => {
    return (
      total +
      sellerItems.reduce(
        (sellerTotal, item) => sellerTotal + (item.quantity || 0),
        0
      )
    );
  }, 0);

  return (
    <nav className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-20 items-center bg-gradient-to-r from-gray-50 to-gray-200 text-gray-700 shadow-lg">
      <div className="flex flex-col items-center py-4 space-y-8">
        <Link href="/" className="text-4xl font-bold text-black mb-4">
          <FaShoppingBag className="text-3xl text-pink-500" />
        </Link>
        <Link href="/" className="text-xl mb-4 hover:text-pink-500">
          <FaHome />
        </Link>
        <button
          onClick={toggleSearch}
          className="text-xl mb-4 hover:text-pink-500"
        >
          <FaSearch />
        </button>
        <Link href="/shop" className="text-xl mb-4 hover:text-pink-500">
          <FaShoppingBag />
        </Link>
        {user || admin ? (
          <Link
            href={`/${user?.uniqueId || admin?.uniqueId}`}
            prefetch={true}
            className="text-xl mb-4 hover:text-pink-500"
          >
            <FaUser />
          </Link>
        ) : (
          <Link href="/sign-in" className="text-xl mb-4 hover:text-pink-500">
            <FaLockOpen />
          </Link>
        )}
        <Link href="/cart" className="text-xl mb-4 hover:text-pink-500">
          <div className="relative">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </Link>
        {user || admin ? (
          <button
            onClick={handleSignOut}
            className="text-xl mb-4 hover:text-red-500"
          >
            <FaSignOutAlt />
          </button>
        ) : null}
      </div>
    </nav>
  );
}
