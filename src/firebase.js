// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "final-project-24db7.firebaseapp.com",
  projectId: "final-project-24db7",
  storageBucket: "final-project-24db7.appspot.com",
  messagingSenderId: "1090713563039",
  appId: "1:1090713563039:web:0152b8af798428d26517aa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);