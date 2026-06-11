import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPAFu_pOCR7YLgzqH39THpsL_M0BdBzn0",
  authDomain: "jansahayak-e68df.firebaseapp.com",
  projectId: "jansahayak-e68df",
  storageBucket: "jansahayak-e68df.firebasestorage.app",
  messagingSenderId: "888690963801",
  appId: "1:888690963801:android:995fcee8fbe9e3f09f4848"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
