import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9IHAfq6WLO23ZG7cdfIauafRydz4HQQ8",
    authDomain: "test-eultra.firebaseapp.com",
    projectId: "test-eultra",
    storageBucket: "test-eultra.firebasestorage.app",
    messagingSenderId: "679888333470",
    appId: "1:679888333470:web:bdf4df00f2f7f6f6ca698f",
    measurementId: "G-LND2142JDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
