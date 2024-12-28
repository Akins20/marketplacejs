import { getUserPurchaseHistory } from "./getUserPurchaseHistory";

// Helper function to apply discounts to a cart
const applyDiscountsToCart = (cartItems, userPurchases, maxDiscountedItems) => {
  let totalDiscountedItems = 0; // Total number of discounted items applied
  const updatedCart = cartItems.map((item) => {
    // Find the purchase history for this specific product
    const purchaseHistory = userPurchases?.find(
      (purchase) => purchase.productId === item.id
    );

    const alreadyDiscounted = purchaseHistory?.discountedItems || 0;
    const usageCount = purchaseHistory?.usageCount || 0;
    const maxUsageTimes = item.promotion?.maxUsageTimes || 0;

    // If promotion exists, apply either percentage or fixed discount amount
    const discountType = item.promotion?.discountType || "percentage"; // Defaults to percentage
    const discountPercentage = parseFloat(
      item.promotion?.discountPercentage || 0
    );
    const discountAmount = parseFloat(item.promotion?.discountAmount || 0);

    // Check if the discount usage has exceeded the max usage times
    if (usageCount >= maxUsageTimes) {
      return {
        ...item,
        discountedPrice: item.price,
        discountedQuantity: 0,
        usageExceeded: true,
      };
    }

    // Calculate the remaining discounted items for this user
    const remainingDiscounts = Math.max(
      0,
      maxDiscountedItems - alreadyDiscounted
    );

    if (totalDiscountedItems < maxDiscountedItems && remainingDiscounts > 0) {
      const discountableQuantity = Math.min(item.quantity, remainingDiscounts);
      totalDiscountedItems += discountableQuantity;

      let discountedPrice;
      if (discountType === "percentage" && discountPercentage > 0) {
        discountedPrice = (item.price * (100 - discountPercentage)) / 100;
      } else if (discountType === "amount" && discountAmount > 0) {
        discountedPrice = Math.max(item.price - discountAmount, 0); // Ensure price never goes below 0
      } else {
        discountedPrice = item.price; // No discount applied
      }

      return {
        ...item,
        discountedPrice,
        discountedQuantity: discountableQuantity,
        nonDiscountedQuantity: item.quantity - discountableQuantity,
        usageCount: usageCount + discountableQuantity, // Increment the usage count by discounted items
      };
    } else {
      // No more discount available for this item
      return {
        ...item,
        discountedPrice: item.price,
        discountedQuantity: 0,
      };
    }
  });

  return { updatedCart, totalDiscountedItems };
};

// Main function to apply discount on checkout
export const applyDiscountOnCheckout = async (userEmail, cart, sellerId) => {
  try {
    const userPurchases = await getUserPurchaseHistory(userEmail); // Fetch user's previous purchases

    const maxDiscountedItems = 6; // Limit of products eligible for discount per purchase
    console.log("This is cart:", JSON.stringify(cart[sellerId]));

    // Apply discounts to the seller's cart items
    const { updatedCart, totalDiscountedItems } = applyDiscountsToCart(
      cart[sellerId],
      userPurchases,
      maxDiscountedItems
    );

    // Calculate total with discounts applied
    const finalUpdatedCart = updatedCart;
    const total = finalUpdatedCart?.reduce(
      (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
      0
    );

    return { updatedCart, total, totalDiscount: totalDiscountedItems }; // Return the updated cart, total, and discount count
  } catch (error) {
    console.error("Error applying discount:", error);
    // In case of error, return the cart as is, with no discount applied
    return {
      updatedCart: cart,
      total: cart[sellerId].reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      totalDiscount: 0, // No discount if there's an error
    };
  }
};
