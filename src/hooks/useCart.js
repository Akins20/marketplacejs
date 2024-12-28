"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import useProvideAuth from "@/components/generalUtils/useAuth";

const useCart = () => {
  const { user } = useProvideAuth(); // Use the custom hook to get authenticated user
  // const [loading, setLoading] = useState(true);
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

  // Helper function to save cart in either localStorage or Firestore
  const syncCartToStorageOrFirestore = async (updatedCart) => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage if not authenticated
    } else {
      const userDocRef = doc(firestore, "users", user.id);
      await updateDoc(userDocRef, { cart: updatedCart }); // Save to Firestore if authenticated
    }
  };

  const addToCart = async (product) => {
    const { sellerId, id: productId, quantity } = product;

    let updatedCart = { ...cart };
    if (!updatedCart[sellerId]) {
      // If no items exist for this seller, create a new array
      updatedCart[sellerId] = [product];
    } else {
      const existingProductIndex = updatedCart[sellerId].findIndex(
        (item) => item.id === productId
      );

      if (existingProductIndex !== -1) {
        // Update the quantity if the product already exists
        updatedCart[sellerId][existingProductIndex].quantity += quantity;
      } else {
        // Add a new product to the seller's cart
        updatedCart[sellerId].push(product);
      }
    }

    setCart(updatedCart);
    await syncCartToStorageOrFirestore(updatedCart);
  };

  const updateCartItem = async (sellerId, updatedItem) => {
    const updatedCart = { ...cart };

    if (updatedCart[sellerId]) {
      updatedCart[sellerId] = updatedCart[sellerId].map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );

      setCart(updatedCart);
      await syncCartToStorageOrFirestore(updatedCart);
    }
  };

  const removeCartItem = async (sellerId, itemId) => {
    const updatedCart = { ...cart };

    if (updatedCart[sellerId]) {
      updatedCart[sellerId] = updatedCart[sellerId].filter(
        (item) => item.id !== itemId
      );

      if (updatedCart[sellerId].length === 0) {
        // Remove the sellerId key if no items remain for this seller
        delete updatedCart[sellerId];
      }

      setCart(updatedCart);
      await syncCartToStorageOrFirestore(updatedCart);
    }
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
    return cart[sellerId] || [];
  };
  // Optimized and updated logic for cart operations

  // Get total quantity of items across all sellers in the cart
  const getTotalCartQuantity = () => {
    return Object.values(cart).reduce((total, sellerCart) => {
      return total + sellerCart.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);
  };

  // Get total price of items across all sellers in the cart
  const getTotalCartPrice = () => {
    return Object.values(cart).reduce((total, sellerCart) => {
      return (
        total +
        sellerCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );
    }, 0);
  };

  // Get total price of items from a specific seller
  const getTotalCartPriceBySeller = (sellerId, cart) => {
    const sellerCart = cart[sellerId] || [];
    return sellerCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Get total quantity of items from a specific seller
  const getTotalCartQuantityBySeller = (sellerId, cart) => {
    const sellerCart = cart[sellerId] || [];
    return sellerCart.reduce((total, item) => total + item.quantity, 0);
  };

  // Remove all items from a specific seller's cart
  const removeAllCartItemsBySeller = async (sellerId, cart) => {
    const updatedCart = { ...cart };
    delete updatedCart[sellerId]; // Delete the seller's cart

    setCart(updatedCart);
    await syncCartToStorageOrFirestore(updatedCart);
  };

  // Update the quantity of a specific item from a specific seller
  const updateCartQuantity = async (sellerId, productId, quantity, cart) => {
    if (quantity <= 0) return; // Prevent invalid quantities

    const updatedCart = { ...cart };
    const sellerCart = updatedCart[sellerId] || [];
    const productIndex = sellerCart.findIndex((item) => item.id === productId);

    if (productIndex !== -1) {
      sellerCart[productIndex].quantity = quantity; // Update the quantity
      updatedCart[sellerId] = sellerCart; // Update the seller's cart
      setCart(updatedCart);
      await syncCartToStorageOrFirestore(updatedCart);
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
  };
};

export default useCart;
