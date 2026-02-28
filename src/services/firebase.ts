import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAdPdxSns-wXCQ2lKUGJ--lEoXfvcJGDeg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ielts-mock-master-blc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ielts-mock-master-blc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ielts-mock-master-blc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "880151157353",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:880151157353:web:8d20f019a01e3cfd78e0f8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NR1WD3EB5N",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://ielts-mock-master-blc-default-rtdb.firebaseio.com"
};

// Initialize Firebase
let app;
try {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY_FROM_CONSOLE") {
    console.warn("Firebase API Key is missing. Please set VITE_FIREBASE_API_KEY in your environment variables.");
  }
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Create a dummy app object to prevent crashes on export
  app = { name: '[DEFAULT]', options: firebaseConfig, automaticDataCollectionEnabled: false };
}

export const db = getFirestore(app as any);
export const auth = getAuth(app as any);
export const storage = getStorage(app as any);
export const analytics = typeof window !== 'undefined' && firebaseConfig.measurementId ? getAnalytics(app as any) : null;

export const isAdmin = (email: string | null | undefined) => {
  if (!email) return false;
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'kaiyumuddin69@gmail.com';
  return email.toLowerCase() === adminEmail.toLowerCase();
};

export default app;
