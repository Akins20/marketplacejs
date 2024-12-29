"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import useProvideAuth from "@/components/generalUtils/useAuth";

const useCart = () => {
  const { user } = useProvideAuth(); // Use the custom hook to get authenticated user
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : {};
    }
    return {};
  });

  // Load the cart from Firestore if the user is authenticated
  useEffect(() => {
    if (user) {
      const loadCartFromFirestore = async () => {
        const userDocRef = doc(firestore, "users", user.id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().cart) {
          const dbCart = userDocSnap.data().cart;
          setCart(dbCart);
        }
      };
      loadCartFromFirestore();
    }
  }, [user]);

  let debounceTimeout = null;

  const syncCartToStorageOrFirestore = async (updatedCart) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Clear the previous timeout if it exists
    }

    // Set a new timeout to delay the actual function call
    debounceTimeout = setTimeout(async () => {
      if (!user) {
        // Save to localStorage if not authenticated
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        const userDocRef = doc(firestore, "users", user.id);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (userDoc.exists()) {
          console.log("Updating cart: ", JSON.stringify(updatedCart));
          await updateDoc(userDocRef, { cart: updatedCart }); // Save to Firestore if authenticated
        }
      }
    }, 2000); // 2000ms delay (adjust as needed)
  };

  const addToCart = async (product) => {
    const {
      sellerId,
      id: productId,
      size,
      color,
      newQuantity,
      quantity,
      price,
    } = product;

    // Ensure newQuantity is within valid bounds
    if (newQuantity > quantity) {
      throw new Error(`Cannot add more than ${quantity} items to the cart.`);
    }

    let updatedCart = { ...cart };
    // Check if the seller already exists in the cart
    if (!updatedCart[sellerId]) {
      // If the seller does not exist, initialize an empty array for the seller
      updatedCart[sellerId] = [];
    }

    // Check if the item already exists in the seller's cart
    const sellerCart = updatedCart[sellerId];
    const existingProductIndex = sellerCart.findIndex(
      (item) =>
        item.id === productId && item.size === size && item.color === color
    );

    if (existingProductIndex === -1) {
      // If the item does not exist, add it as a new item
      sellerCart.push({ ...product, newQuantity });
    } else {
      // If the item already exists, update the quantity
      const existingProduct = sellerCart[existingProductIndex];
      existingProduct.newQuantity += newQuantity;

      // Ensure total quantity does not exceed stock
      if (existingProduct.newQuantity > quantity) {
        existingProduct.newQuantity = quantity;
      }
    }

    // Update the cart state and sync it with storage
    setCart(updatedCart);
    await syncCartToStorageOrFirestore(updatedCart);
  };

  const updateCartItem = async (sellerId, updatedItem) => {
    const { id: productId, size, color, newQuantity, quantity } = updatedItem;

    // Ensure newQuantity is within valid bounds
    if (newQuantity > quantity) {
      alert("Cannot update quantity beyond available stock");
      throw new Error(
        `Cannot update quantity beyond available stock (${quantity}).`
      );
    }

    const updatedCart = { ...cart };
    const productKey = size && color ? `${size}-${color}` : productId;

    if (updatedCart[sellerId] && updatedCart[sellerId][productKey]) {
      updatedCart[sellerId][productKey] = { ...updatedItem, newQuantity }; // Update item
    }

    setCart(updatedCart);
    await syncCartToStorageOrFirestore(updatedCart);
  };

  const removeCartItem = async (sellerId, productId, size, color) => {
    const updatedCart = { ...cart };
    const productKey = size && color ? `${size}-${color}` : productId;

    if (updatedCart[sellerId] && updatedCart[sellerId][productKey]) {
      delete updatedCart[sellerId][productKey]; // Remove item

      if (Object.keys(updatedCart[sellerId]).length === 0) {
        delete updatedCart[sellerId]; // Remove seller if cart is empty
      }
    }

    setCart(updatedCart);
    await syncCartToStorageOrFirestore(updatedCart);
  };

  const clearCart = async () => {
    setCart({});
    localStorage.removeItem("cart"); // Clear localStorage cart

    if (user) {
      const userDocRef = doc(firestore, "users", user.id);
      await updateDoc(userDocRef, { cart: {} }); // Clear Firestore cart if authenticated
    }
  };

  const getCartBySeller = (sellerId) => {
    return cart[sellerId] || {};
  };

  const getTotalCartQuantity = () => {
    return Object.values(cart).reduce((total, sellerCart) => {
      return (
        total +
        Object.values(sellerCart).reduce(
          (sum, item) => sum + item.newQuantity,
          0
        )
      );
    }, 0);
  };

  const getTotalCartPrice = () => {
    return Object.values(cart).reduce((total, sellerCart) => {
      return (
        total +
        Object.values(sellerCart).reduce(
          (sum, item) => sum + item.price * item.newQuantity,
          0
        )
      );
    }, 0);
  };

  const getTotalCartPriceBySeller = (sellerId) => {
    const sellerCart = cart[sellerId] || {};
    return Object.values(sellerCart).reduce(
      (total, item) => total + item.price * item.newQuantity,
      0
    );
  };

  const getTotalCartQuantityBySeller = (sellerId) => {
    const sellerCart = cart[sellerId] || {};
    return Object.values(sellerCart).reduce(
      (total, item) => total + item.newQuantity,
      0
    );
  };

  const removeAllCartItemsBySeller = async (sellerId) => {
    const updatedCart = { ...cart };
    delete updatedCart[sellerId]; // Delete the seller's cart

    setCart(updatedCart);
    await syncCartToStorageOrFirestore(updatedCart);
  };

  const updateCartQuantity = async (
    sellerId,
    productId,
    newQuantity,
    availableQuantity // Renamed 'quantity' to 'availableQuantity' for clarity
  ) => {
    if (newQuantity <= 0 || newQuantity > availableQuantity) {
      // Prevent invalid quantities or quantities greater than stock
      alert(
        "Invalid quantity. Please enter a quantity between 1 and the available stock."
      );

      throw new Error(`Quantity must be between 1 and ${availableQuantity}.`);
    }

    const updatedCart = { ...cart };

    // Check if the seller exists in the cart
    if (updatedCart[sellerId]) {
      const sellerCart = updatedCart[sellerId];

      // Find the product in the seller's cart by matching product.id
      const productIndex = sellerCart.findIndex(
        (product) => product.id === productId
      );

      if (productIndex !== -1) {
        // Update the quantity for the matching product
        sellerCart[productIndex].newQuantity = newQuantity;
        setCart(updatedCart); // Update local state

        // Sync updated cart to localStorage or Firestore
        await syncCartToStorageOrFirestore(updatedCart);
      } else {
        throw new Error("Product not found in cart for this seller.");
      }
    } else {
      throw new Error("Seller not found in cart.");
    }
  };
  // utils/cartUtils.js
  const filterCart = (cart, sellerId) => {
    if (sellerId) {
      return Array.isArray(cart[sellerId]) ? cart[sellerId] : [];
    } else {
      // Flatten the cart if no sellerId is provided, assuming cart is an object with sellerIds as keys
      return Object.values(cart || {}).flat() || [];
    }
  };

  return {
    cart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartBySeller,
    getTotalCartQuantity,
    getTotalCartPrice,
    getTotalCartPriceBySeller,
    getTotalCartQuantityBySeller,
    removeAllCartItemsBySeller,
    updateCartQuantity,
    filterCart
  };
};

export default useCart;
