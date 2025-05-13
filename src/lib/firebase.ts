// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCnAK5zHbWKgu8RH3fUmWmj5uHploP_FOE",
  authDomain: "umoja-linn-1ba27.firebaseapp.com",
  projectId: "umoja-linn-1ba27",
  storageBucket: "umoja-linn-1ba27.firebasestorage.app",
  messagingSenderId: "753143096460",
  appId: "1:753143096460:web:e732af784b261f741d07a9",
  measurementId: "G-VX7QDFTSBF",
  databaseURL:
    "https://umoja-linn-1ba27-default-rtdb.europe-west1.firebasedatabase.app/",
} satisfies FirebaseOptions;

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
