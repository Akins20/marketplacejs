import { firestore } from "./firebase.js";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid"; // Unique IDs for notifications

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      customerInfo,
      deliveryInfo, // Include deliveryInfo from the request
      cart,
      totalAmount,
      transactionReference,
    } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "your email", // Admin email fallback
          pass: process.env.EMAIL_PASS || "email pass", // Admin password fallback
        },
        tls: {
          rejectUnauthorized: false, // Accept self-signed certificates
        },
      });

      const currentTime = new Date().toLocaleString(); // Current date and time
      const adminEmail = process.env.EMAIL_USER || "your email";
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
        deliveryInfo, // Include deliveryInfo in the stored data
        cart,
        transactionReference,
        totalAmount,
        timestamp: serverTimestamp(),
        notificationIds: [],
      });

      // Admin email content with order, customer, and delivery details
      const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Order Received</h2>
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
                <h4>Products for ${
                  sellerEmail === adminEmail
                    ? "Admin (Site Owner)"
                    : `Seller: ${sellerEmail}`
                }</h4>
                <table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr>
                      <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sellerProducts
                      .map(
                        (item) => `
                          <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.title}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${item.newQuantity}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">₦${item.price}</td>
                          </tr>
                        `
                      )
                      .join("")}
                  </tbody>
                </table>
              `;
            })
            .join("")}
          <p><strong>Total Amount:</strong> ₦${totalAmount / 100}</p>
        </div>
      `;

      // Send email to admin
      await transporter.sendMail({
        from: adminEmail,
        to: adminEmail,
        subject: `New Order - ${transactionReference}`,
        html: adminEmailHtml,
      });

      // Send email to customer with order summary and delivery info
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
          <table style="width:100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f2f2f2;">Product</th>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f2f2f2;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 10px; background-color: #f2f2f2;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${cart
                .map(
                  (item) => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 10px;">${item.title}</td>
                      <td style="border: 1px solid #ddd; padding: 10px;">${item.newQantity}</td>
                      <td style="border: 1px solid #ddd; padding: 10px;">₦${item.price}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
          <p style="text-align: right;"><strong>Total Amount:</strong> ₦${
            totalAmount / 100
          }</p>
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
            <div style="font-family: Arial, sans-serif;">
              <h2>New Order for Your Products</h2>
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
              <table style="width:100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${sellerProducts
                    .map(
                      (item) => `
                        <tr>
                          <td style="border: 1px solid #ddd; padding: 8px;">${item.title}</td>
                          <td style="border: 1px solid #ddd; padding: 8px;">${item.newQantity}</td>
                          <td style="border: 1px solid #ddd; padding: 8px;">₦${item.price}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
              <p><strong>Total Amount for Your Products:</strong> ₦${sellerProducts.reduce(
                (sum, item) => sum + item.price * item.newQuantity,
                0
              )}</p>
            </div>
          `;

          return transporter.sendMail({
            from: adminEmail,
            to: sellerEmail,
            subject: `New Order for Your Products - ${transactionReference}`,
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
