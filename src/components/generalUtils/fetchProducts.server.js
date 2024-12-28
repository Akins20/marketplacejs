import { firestore } from "@/firebase";
import { getDocs, collection } from "firebase/firestore";

export const fetchSingleProduct = async (productId, setProduct, setLoading) => {
  try {
    const productQuery = collection(firestore, "products");
    const productSnapshot = await getDocs(productQuery);

    const normalizedProductId = productId
      .toLowerCase()
      .trim()
      .replace(/-/g, " ");

    let matchedProduct = null;
    productSnapshot.docs.forEach((doc) => {
      const productData = doc.data();
      const normalizedTitle = productData.title
        .toLowerCase()
        .trim()
        .replace(/-/g, " ");
      if (normalizedTitle === normalizedProductId) {
        matchedProduct = productData;
      }
    });

    if (matchedProduct) {
      setProduct(matchedProduct);
    }
  } catch (error) {
    console.error("Error fetching product: ", error);
  } finally {
    setLoading(false);
  }
};
