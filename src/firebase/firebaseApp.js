import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

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
