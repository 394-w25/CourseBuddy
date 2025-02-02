import { collection, setDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";


async function addLikedPostField() {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        setDoc(doc.ref, { likedPosts: [] }, { merge: true });
        console.log(doc.id, " => ", doc.data());
    })
}

addLikedPostField();
