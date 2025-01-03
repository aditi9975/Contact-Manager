import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // For Realtime Database
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2uR_BaYSVjaaxpENJrqpZoPuj7p2s0xM",
  authDomain: "contact-manager-1312.firebaseapp.com",
  databaseURL: "https://contact-manager-1312-default-rtdb.firebaseio.com", // Correct URL for RTDB
  projectId: "contact-manager-1312",
  storageBucket: "contact-manager-1312.appspot.com", // Firebase Storage bucket URL
  messagingSenderId: "368909842749",
  appId: "1:368909842749:web:afadf85a1497c6b021ed54",
  measurementId: "G-4QE4FXEM36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export { app, db };
