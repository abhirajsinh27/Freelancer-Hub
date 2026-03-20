// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5ihdgqNJjdsbL7tQoMPLVGbS2uS-bkwE",
  authDomain: "freelancer-marketplace-d9981.firebaseapp.com",
  projectId: "freelancer-marketplace-d9981",
  storageBucket: "freelancer-marketplace-d9981.firebasestorage.app",
  messagingSenderId: "83896917768",
  appId: "1:83896917768:web:29ab710be5c339057296bd",
  measurementId: "G-87VZ7B7J1D"
};


const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);
// Firestore Database
export const db = getFirestore(app); 

export default app;
