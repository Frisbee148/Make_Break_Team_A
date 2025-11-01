import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// PASTE YOUR NEWLY COPIED CONFIG OBJECT HERE
const firebaseConfig = {
  apiKey: "AIzaSy...YOUR_REAL_KEY...",
  authDomain: "snippet-manager-1234.firebaseapp.com",
  projectId: "snippet-manager-1234",
  storageBucket: "snippet-manager-1234.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll need
export const auth = getAuth(app);
export const db = getFirestore(app);