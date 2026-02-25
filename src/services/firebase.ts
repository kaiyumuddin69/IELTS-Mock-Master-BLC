import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdPdxSns-wXCQ2lKUGJ--lEoXfvcJGDeg",
  authDomain: "ielts-mock-master-blc.firebaseapp.com",
  projectId: "ielts-mock-master-blc",
  storageBucket: "ielts-mock-master-blc.firebasestorage.app",
  messagingSenderId: "880151157353",
  appId: "1:880151157353:web:8d20f019a01e3cfd78e0f8",
  measurementId: "G-NR1WD3EB5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
