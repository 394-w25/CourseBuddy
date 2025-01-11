import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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

const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// Example query code:
// const querySnapshot = await getDocs(collection(db, "posts"));
// querySnapshot.forEach((doc) => {
//     console.log(doc.id, "=>", doc.data());
// });