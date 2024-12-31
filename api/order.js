import nodemailer from "nodemailer";
import {
  setDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
  serverTimestamp,
  query,
  where,
  getDoc
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "./firebase.js";

export const calculateAdditionalCharge = (price) => {
  if (price < 10000) return 1500; // For prices below ₦10,000
  if (price < 20000) return 3000; // For prices between ₦10,000 and ₦20,000
  if (price < 30000) return 4500; // For prices between ₦20,000 and ₦30,000
  return Math.floor(price / 10000) * 1500; // For prices above ₦30,000, add ₦1,500 per ₦10,000 increment
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      customerInfo,
      deliveryInfo,
      cart,
      transactionReference,
      totalAmount,
    } = req.body;

    try {
      // Set up email transporter using nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "ogascountyng@gmail.com", // Admin email fallback
          pass: process.env.EMAIL_PASS || "fuhcocpoxnqrxxmg", // Admin password fallback
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const currentTime = new Date().toLocaleString(); // Get current date and time
      const adminEmail = process.env.EMAIL_USER || "ogascountyng@gmail.com"; // Admin email fallback
      const orderId = uuidv4(); // Generate a unique ID for the order

      // Group products by seller email or default to admin
      const sellerGroups = cart.reduce((acc, item) => {
        const sellerEmail = item.sellerEmail || adminEmail; // Default to admin if seller email is missing
        if (!acc[sellerEmail]) acc[sellerEmail] = [];
        acc[sellerEmail].push(item);
        return acc;
      }, {});

      // Save the order details and delivery info to Firestore
      await setDoc(doc(firestore, "orders", orderId), {
        id: orderId,
        customerInfo,
        deliveryInfo,
        cart,
        transactionReference,
        totalAmount,
        timestamp: serverTimestamp(),
        notificationIds: [],
      });

      // Deduct product quantities from Firestore based on variants or non-variants
      for (const item of cart) {
        // Fetch the product from Firestore
        const normalizedProductId = item.productId
        .toLowerCase()
        .trim()
        .replace(/-/g, " ");
        const productRef = doc(firestore, "products", normalizedProductId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();

          // Check if the product has variants
          if (item.variantId) {
            // Deduct the quantity for a variant product
            const variant = productData.variants.find(
              (variant) => variant.id === item.variantId
            );

            if (variant) {
              const updatedQuantity = variant.quantity - item.newQuantity;
              await updateDoc(productRef, {
                [`variants.${productData.variants.indexOf(variant)}.quantity`]:
                  updatedQuantity,
              });
            } else {
              console.error("Variant not found for product: ", item.productId);
            }
          } else {
            // Deduct the quantity for a non-variant product
            const updatedQuantity = productData.quantity - item.newQuantity;
            await updateDoc(productRef, {
              quantity: updatedQuantity,
            });
          }
        } else {
          console.error("Product not found in Firestore: ", item.productId);
        }
      }

      // Step 1: Fetch the user's document in the "users" collection where email matches
      const usersCollection = collection(firestore, "users");
      const q = query(
        usersCollection,
        where("email", "==", customerInfo.email)
      );
      const userDocs = await getDocs(q);

      if (!userDocs.empty) {
        const userDoc = userDocs.docs[0];
        const userRef = doc(firestore, "users", userDoc.id);
        const existingOrders = userDoc.data().orders || [];
        await updateDoc(userRef, {
          orders: [...existingOrders, orderId],
        });
      } else {
        console.error("User not found");
      }

      // Step 2: Update each seller's orders in the "sellers" collection
      const adminsCollection = collection(firestore, "sellers");

      const sellerPromises = Object.keys(sellerGroups).map(
        async (sellerEmail) => {
          if (sellerEmail !== adminEmail) {
            const adminQuery = query(
              adminsCollection,
              where("email", "==", sellerEmail)
            );
            const adminDocs = await getDocs(adminQuery);

            if (!adminDocs.empty) {
              const adminDoc = adminDocs.docs[0];
              const adminRef = doc(firestore, "sellers", adminDoc.id);
              const existingOrders = adminDoc.data().orders || [];
              await updateDoc(adminRef, {
                orders: [...existingOrders, orderId],
              });
            } else {
              console.error(
                `Seller not found for seller email: ${sellerEmail}`
              );
            }
          }
        }
      );

      await Promise.all(sellerPromises);

      const tableStyles = `
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    `;

      const tableHeaderStyles = `
      border: 1px solid #ddd;
      padding: 10px;
      background-color: #f2f2f2;
      text-align: left;
    `;

      const tableCellStyles = `
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    `;

      // Email content for admin
      const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #4CAF50;">New Order Received</h2>
        <p><strong>Customer:</strong> ${customerInfo.name} (${
        customerInfo.email
      })</p>
        <p><strong>Phone Number:</strong> ${customerInfo.phone}</p>
        <p><strong>Delivery Address:</strong> ${deliveryInfo.address}, ${
        deliveryInfo.city
      }, ${deliveryInfo.state}, ${deliveryInfo.postalCode}, ${
        deliveryInfo.country
      }</p>
        <p><strong>Order Date:</strong> ${currentTime}</p>
        <p><strong>Transaction Reference:</strong> ${transactionReference}</p>
        <h3>Order Details</h3>
        ${Object.keys(sellerGroups)
          .map((sellerEmail) => {
            const sellerProducts = sellerGroups[sellerEmail];
            return `
              <h4 style="text-align: left;">Products for ${
                sellerEmail === adminEmail
                  ? "Admin (Site Owner)"
                  : `Seller: ${sellerEmail}`
              }</h4>
              <table style="${tableStyles}">
                <thead>
                  <tr>
                    <th style="${tableHeaderStyles}">Product</th>
                    <th style="${tableHeaderStyles}">Quantity</th>
                    <th style="${tableHeaderStyles}">Original Price</th>
                    <th style="${tableHeaderStyles}">Discounted Price</th>
                    <th style="${tableHeaderStyles}">Size</th>
                    <th style="${tableHeaderStyles}">Color</th>
                  </tr>
                </thead>
                <tbody>
                  ${sellerProducts
                    .map(
                      (item) => `
                      <tr>
                        <td style="${tableCellStyles}">${item.title}</td>
                        <td style="${tableCellStyles}">${item.quantity}</td>
                        <td style="${tableCellStyles}">₦${item.price}</td>
                        <td style="${tableCellStyles}">₦${
                        item.discountedPrice || item.price
                      }</td>
                        <td style="${tableCellStyles}">${
                        item.size || "N/A"
                      }</td>
                        <td style="${tableCellStyles}">${
                        item.color || "N/A"
                      }</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            `;
          })
          .join("")}
        <p style="text-align: right;"><strong>Total Amount:</strong> ₦${(
          totalAmount / 100
        ).toFixed(2)}</p>
      </div>
    `;

      await transporter.sendMail({
        from: adminEmail,
        to: adminEmail,
        subject: `New Order - ${transactionReference}`,
        html: adminEmailHtml,
      });

      // Email content for customer
      const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #4CAF50;">Thank you for your order!</h2>
        <p>Hi ${customerInfo.name},</p>
        <p>Thank you for shopping with us! Your order has been successfully placed. Please expect delivery within the next 7 days.</p>
        <p><strong>Delivery Address:</strong> ${deliveryInfo.address}, ${
        deliveryInfo.city
      }, ${deliveryInfo.state}, ${deliveryInfo.postalCode}, ${
        deliveryInfo.country
      }</p>
        <p><strong>Order Date:</strong> ${currentTime}</p>
        <p><strong>Transaction Reference:</strong> ${transactionReference}</p>
        <h3 style="color: #4CAF50;">Order Summary</h3>
        <table style="${tableStyles}">
          <thead>
            <tr>
              <th style="${tableHeaderStyles}">Product</th>
              <th style="${tableHeaderStyles}">Quantity</th>
              <th style="${tableHeaderStyles}">Original Price</th>
              <th style="${tableHeaderStyles}">Discounted Price</th>
            </tr>
          </thead>
          <tbody>
            ${cart
              .map(
                (item) => `
                  <tr>
                    <td style="${tableCellStyles}">${item.title}</td>
                    <td style="${tableCellStyles}">${item.quantity}</td>
                    <td style="${tableCellStyles}">₦${item.price}</td>
                    <td style="${tableCellStyles}">₦${
                  item.discountedPrice || item.price
                }</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
        <p style="text-align: right;"><strong>Total Amount:</strong> ₦${(
          totalAmount / 100
        ).toFixed(2)}</p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br/>The Marketplace Team</p>
      </div>
    `;

      await transporter.sendMail({
        from: adminEmail,
        to: customerInfo.email,
        subject: `Your Order Confirmation - ${transactionReference}`,
        html: customerEmailHtml,
      });

      // Send emails to individual sellers (excluding admin)
      const sellerEmailPromises = Object.keys(sellerGroups)
        .filter((sellerEmail) => sellerEmail !== adminEmail) // Exclude admin email
        .map((sellerEmail) => {
          const sellerProducts = sellerGroups[sellerEmail];
          const sellerEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #4CAF50;">New Order for Your Products</h2>
            <p><strong>Customer:</strong> ${customerInfo.name} (${
            customerInfo.email
          })</p>
            <p><strong>Phone Number:</strong> ${customerInfo.phone}</p>
            <p><strong>Delivery Address:</strong> ${deliveryInfo.address}, ${
            deliveryInfo.city
          }, ${deliveryInfo.state}, ${deliveryInfo.postalCode}, ${
            deliveryInfo.country
          }</p>
            <p><strong>Order Date:</strong> ${currentTime}</p>
            <p><strong>Transaction Reference:</strong> ${transactionReference}</p>
            <h3 style="color: #4CAF50;">Order Details</h3>
            <table style="${tableStyles}">
              <thead>
                <tr>
                  <th style="${tableHeaderStyles}">Product</th>
                  <th style="${tableHeaderStyles}">Quantity</th>
                  <th style="${tableHeaderStyles}">Original Price</th>
                  <th style="${tableHeaderStyles}">Discounted Price</th>
                </tr>
              </thead>
              <tbody>
                ${sellerProducts
                  .map(
                    (item) => `
                      <tr>
                        <td style="${tableCellStyles}">${item.title}</td>
                        <td style="${tableCellStyles}">${item.quantity}</td>
                        <td style="${tableCellStyles}">₦${item.price}</td>
                        <td style="${tableCellStyles}">₦${
                      item.discountedPrice || item.price
                    }</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
            <p style="text-align: right;"><strong>Total Amount for Your Products:</strong> ₦${sellerProducts.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            )}</p>
          </div>
        `;

          return transporter.sendMail({
            from: adminEmail,
            to: sellerEmail,
            subject: `New Order - ${transactionReference}`,
            html: sellerEmailHtml,
          });
        });

      await Promise.all(sellerEmailPromises);

      res
        .status(200)
        .json({ message: "Order notifications sent successfully", orderId });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending email" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
