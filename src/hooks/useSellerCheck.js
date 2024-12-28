import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase"; // Adjust to your Firebase config

const useSellerCheck = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch sellers from Firestore when the hook is initialized
    const fetchSellers = async () => {
      try {
        const sellersCollection = collection(firestore, "admins"); // Assuming "admins" collection holds sellers
        const sellerDocs = await getDocs(sellersCollection);
        const sellerList = sellerDocs.docs.map((doc) => doc.data());
        // console.log("These are all sellers: " + sellerList)


        // Filter sellers who have completed their details (firstName, lastName, phone, address, and image)
        const completeSellers = sellerList.filter(
          (seller) =>
            seller.firstName &&
            seller.lastName &&
            seller.phoneNumber &&
            seller.address &&
            seller.adminImage // Assuming `adminImage` is the field for the profile image
        );

        // console.log("These are verified seller: " + completeSellers)

        setSellers(completeSellers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  // Check if the user is a verified seller
  const isSeller = (user) => {
    if (!user) return false;
    return (
      !user.isAdmin || sellers.some((seller) => seller.email === user.email)
    );
  };

  // Check if the product is sold by a verified seller
  const isProductSoldBySeller = (product) => {
    if (!product) return false;
    return sellers.some((seller) => seller.email === product.sellerEmail);
  };

  return { isSeller, isProductSoldBySeller, loading };
};

export default useSellerCheck;
