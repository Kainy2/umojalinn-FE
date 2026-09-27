// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}"
)

// Initialize Firebase Realtime database and firebase analytics
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// export const analytics = getAnalytics(app);
// Analytics: only initialise in the browser
let analytics: Analytics | undefined;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };