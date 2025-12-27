
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Ensure no undefined values are passed to initializeApp
const isConfigValid = Object.values(firebaseConfig).every((val) => val);

let app: FirebaseApp;
let db: Firestore;

if (!isConfigValid) {
    console.error("Firebase config is missing or invalid. Check your .env file. Firebase features will be disabled.");
    // Assign null to prevent crashes, but features will not work.
    app = null as any;
    db = null as any; 
} else {
    // This is the robust way to initialize in a server/client environment like Next.js
    if (getApps().length) {
        app = getApp();
    } else {
        app = initializeApp(firebaseConfig);
    }
    db = getFirestore(app);
}

// Export the initialized instances
export { app, db };
