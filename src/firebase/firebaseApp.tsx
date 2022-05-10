import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxKegAvCRvnZR-FQxl2EKBQoZr04TfCyc",
  authDomain: "react-danceblue.firebaseapp.com",
  databaseURL: "https://react-danceblue.firebaseio.com",
  projectId: "react-danceblue",
  storageBucket: "react-danceblue.appspot.com",
  messagingSenderId: "480114538491",
  appId: "1:480114538491:web:62aac53817d2c43ba2bd5e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const functions = getFunctions();
export const firestore = getFirestore();
export const storage = getStorage();

if (process.env.NODE_ENV === "development") {
  const enabledEmulators = {
    firestoreEmulator: false,
    authEmulator: false,
    functionsEmulator: false,
    storageEmulator: false,
  };

  // Dynamic import are used here to avoid importing unnecessary code in production
  if (enabledEmulators.firestoreEmulator) {
    const { connectFirestoreEmulator } = await import("firebase/firestore");
    connectFirestoreEmulator(firestore, "localhost", 8080);
  }

  if (enabledEmulators.authEmulator) {
    const { connectAuthEmulator } = await import("firebase/auth");
    connectAuthEmulator(auth, "http://localhost:9099");
  }

  if (enabledEmulators.functionsEmulator) {
    const { connectFunctionsEmulator } = await import("firebase/functions");
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

  if (enabledEmulators.storageEmulator) {
    const { connectStorageEmulator } = await import("firebase/storage");
    connectStorageEmulator(storage, "localhost", 9199);
  }
}
