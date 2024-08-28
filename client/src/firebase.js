// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-66102.firebaseapp.com",
  projectId: "blog-app-66102",
  storageBucket: "blog-app-66102.appspot.com",
  messagingSenderId: "613837418245",
  appId: "1:613837418245:web:71eaee907258492843116c",
  measurementId: "G-HK4LR3DPKN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
