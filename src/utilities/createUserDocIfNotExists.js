import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * After a user signs in with Google, call this function to ensure there's 
 * a "users/{user.uid}" doc in Firestore so the friend system can update 
 * the user's "friends" array, etc.
 */
export async function createUserDocIfNotExists(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  
  // We "merge" so we don't overwrite any existing fields
  await setDoc(
    userRef,
    {
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
      friends: []  // If doc already exists, it won't overwrite unless empty
    },
    { merge: true }
  );
}
