// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";         // Added this
import { getFirestore } from "firebase/firestore"; // Added this
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs5g7guupTmje9OzQ4rQlr99Ih1qX5UoA",
  authDomain: "study-om-20d83.firebaseapp.com",
  projectId: "study-om-20d83",
  storageBucket: "study-om-20d83.firebasestorage.app",
  messagingSenderId: "851065777656",
  appId: "1:851065777656:web:8ec0661b640ea5dc87fa0d",
  measurementId: "G-HLWTRY37CT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize and Export Auth and Firestore
export const auth = getAuth(app);       // This was missing
export const db = getFirestore(app);    // This was missing