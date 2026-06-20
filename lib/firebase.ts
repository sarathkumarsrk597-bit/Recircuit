import { initializeApp, getApps } from "@firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

const rawFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const firebaseReady = Boolean(
    rawFirebaseConfig.apiKey &&
    rawFirebaseConfig.authDomain &&
    rawFirebaseConfig.projectId &&
    rawFirebaseConfig.messagingSenderId &&
    rawFirebaseConfig.appId
);

const firebaseConfig = firebaseReady
  ? rawFirebaseConfig
  : {
      apiKey: "demo-api-key",
      authDomain: "demo-recircuit.firebaseapp.com",
      projectId: "demo-recircuit",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:0000000000000000000000"
    };

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
