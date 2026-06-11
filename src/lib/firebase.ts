import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

// Use AsyncStorage persistence on native, default on web
let auth: ReturnType<typeof getAuth>;
if (getApps().length === 1 && Platform.OS !== 'web') {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch {
    auth = getAuth(app);
  }
} else {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
