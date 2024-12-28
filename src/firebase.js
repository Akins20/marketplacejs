// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-4D8OiO9WtHBplqb3JyPxPKkb3yzLvas",
  authDomain: "nuwa-hairdress.firebaseapp.com",
  projectId: "nuwa-hairdress",
  storageBucket: "nuwa-hairdress.appspot.com",
  messagingSenderId: "6443798503",
  appId: "1:6443798503:web:ff6d74e632c71143b23742",
  measurementId: "G-DSLH2GN316",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
