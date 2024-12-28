// // import {
// //   ref as storageRef,
// //   uploadBytes,
// //   getDownloadURL,
// // } from "@firebase/storage";
// // import { storage, firestore } from "../../../firebase";
// // import { getDoc, doc } from "firebase/firestore";

// export const fetchSubscriptionData = async (userStripeId, billingId) => {
//   try {
//     const url = `https://nwjpmd42mnklpgyp2tl7zpxwwi0btrgk.lambda-url.us-east-1.on.aws/`;
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userStripeId, billingId }),
//     });
//     if (response.ok) {
//       const data = await response.json();
//       // console.log("Subscription data:", data);
//       return data;
//     } else {
//       console.error("Failed to fetch subscription data:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching subscription data:", error);
//   }
// };
