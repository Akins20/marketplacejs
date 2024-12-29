import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase"; // Adjust the path to your Firebase config

// Helper function to format product titles into URL-friendly format
const formatTitleForUrl = (title) => {
  return title.trim().replace(/\s+/g, "-").toLowerCase();
};

export default async function sitemap() {
  const baseUrl = "https://marketplacejs.com"; // Your base URL

  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
   
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Fetch product data from Firestore
  const productsCollection = collection(firestore, "products");
  const productSnapshot = await getDocs(productsCollection);

  // Generate dynamic product pages
  const productPages = productSnapshot.docs.map((doc) => {
    const { title } = doc.data();
    const formattedTitle = formatTitleForUrl(title);

    return {
      url: `${baseUrl}/shop/${formattedTitle}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    };
  });

  // Combine static and dynamic pages
  return [...staticPages, ...productPages];
}
