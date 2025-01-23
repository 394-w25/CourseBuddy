import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore"; 
import { get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD-krnRmbEFVtEXdM4wSwFVezwPxHfx2Nw",
  authDomain: "coursebuddy-cs394.firebaseapp.com",
  databaseURL: "https://coursebuddy-cs394-default-rtdb.firebaseio.com",
  projectId: "coursebuddy-cs394",
  storageBucket: "coursebuddy-cs394.firebasestorage.app",
  messagingSenderId: "239829987930",
  appId: "1:239829987930:web:14e1a80ca8a2b0c8d25e63",
  measurementId: "G-K41R79WX73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Only initialize analytics if running in a browser -- this is for dataInsertion.js
// We probably don't need this for the final project
export let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const signInWithGoogle = async () => {
  try{
    setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return {user};
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
}