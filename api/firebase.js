// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ8kytJQJv2M2OW-0_LZr5vmEa77hcRys",
  authDomain: "megacommerce-cbc47.firebaseapp.com",
  projectId: "megacommerce-cbc47",
  storageBucket: "megacommerce-cbc47.appspot.com",
  messagingSenderId: "1032850360763",
  appId: "1:1032850360763:web:3c65c608eb34e05a449c9e",
  measurementId: "G-M1DST6J337",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
