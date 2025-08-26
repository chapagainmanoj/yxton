import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
    console.error("Missing VITE_FIREBASE_* env vars");
    throw new Error("Firebase env missing");
}

const app = initializeApp(firebaseConfig);

// prefer initializeFirestore so we can enable long-polling fallback for local dev
export const db = typeof initializeFirestore === "function"
    ? initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: true })
    : getFirestore(app);

export const auth = getAuth(app);

// connect to emulators when requested via env (optional)
if (import.meta.env.VITE_USE_FIRESTORE_EMULATOR === "true") {
    const host = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || "localhost";
    const port = Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT || 8080);
    console.info(`Connecting Firestore emulator at ${host}:${port}`);
    connectFirestoreEmulator(db, host, port);
}

if (import.meta.env.VITE_USE_AUTH_EMULATOR === "true") {
    const host = import.meta.env.VITE_AUTH_EMULATOR_HOST || "http://localhost:9099";
    console.info(`Connecting Auth emulator at ${host}`);
    connectAuthEmulator(auth, host, { disableWarnings: true });
}

export default app;