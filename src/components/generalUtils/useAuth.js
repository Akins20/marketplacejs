"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase"; // Ensure db is imported from your firebase setup

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true); // Start loading when auth state changes
      setError(null); // Reset errors on auth change

      if (authUser) {
        try {
          // Check if the user is in the 'admins' collection first
          const adminDoc = await getDoc(doc(firestore, "admins", authUser.uid));
          if (adminDoc.exists()) {
            setAdmin({ id: authUser.uid, ...adminDoc.data() });
            setUser(null); // Clear user state if they're an admin
          } else {
            // Otherwise, check the 'users' collection
            const userDoc = await getDoc(doc(firestore, "users", authUser.uid));
            if (userDoc.exists()) {
              setUser({ id: authUser.uid, ...userDoc.data() });
              setAdmin(null); // Clear admin state if they're a user
            } else {
              setUser(null);
              setAdmin(null); // Clear both states if neither found
            }
          }
        } catch (err) {
          console.error("Error fetching user/admin data:", err);
          setError("Failed to load user/admin data.");
          setUser(null);
          setAdmin(null);
        }
      } else {
        // If no authenticated user, clear both user and admin
        setUser(null);
        setAdmin(null);
      }

      setLoading(false); // End loading after state is set
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    admin, // Expose admin state as well
    loading, // Expose loading state
    error, // Expose error state
  };
}

export default useProvideAuth;
