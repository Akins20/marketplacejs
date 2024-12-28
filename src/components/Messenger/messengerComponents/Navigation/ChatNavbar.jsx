"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { ref, set } from "firebase/database";
import { db, firestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ChatNavbar({ username }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, `users/${user.email}`);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({ ...user, username: userData.username });

          const userStatusRef = ref(db, `onlineUsers/${userData.username}`);
          set(userStatusRef, true);

          window.addEventListener("beforeunload", () => {
            set(userStatusRef, null);
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains("dark");
    // console.log("THis is user:", user)
    setIsDarkMode(currentTheme);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="relative flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
      {/* <h1 className="text-xl dark:text-white">
        <Link href="/">Realtime Chat App</Link>
      </h1> */}
      <h3>{username}</h3>
      <div className="flex items-center">
        <button onClick={handleToggleTheme} className="dark:text-white mr-4">
          {isDarkMode ? "🌙" : "🌞"}
        </button>
        {!user ? (
          <>
            <Link href="/login" className="dark:text-white mr-4">
              Login
            </Link>
            <Link href="/signup" className="dark:text-white">
              Signup
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="dark:text-white">
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
