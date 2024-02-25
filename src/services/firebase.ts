// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaJ2dVed8kRctiPFNetk7yqGZALJXbZQk",
  authDomain: "inventaris-sarana.firebaseapp.com",
  projectId: "inventaris-sarana",
  storageBucket: "inventaris-sarana.appspot.com",
  messagingSenderId: "247472205631",
  appId: "1:247472205631:web:18b21f5a1ecef45b686d8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)