import { db } from '../utilities/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

export async function sendFriendRequest(fromUserId, toUserId) {
  try {
    const ref = collection(db, 'friendRequests');
    await addDoc(ref, {
      from: fromUserId,
      to: toUserId,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    console.log('Friend request sent!');
  } catch (error) {
    console.error('Error sending friend request:', error);
  }
}

export async function acceptFriendRequest(reqId, fromUserId, toUserId) {
  try {
    const reqRef = doc(db, 'friendRequests', reqId);
    await updateDoc(reqRef, { status: 'accepted' });

    const fromDoc = doc(db, 'users', fromUserId);
    const toDoc = doc(db, 'users', toUserId);

    await updateDoc(fromDoc, {
      friends: arrayUnion(toUserId)
    });
    await updateDoc(toDoc, {
      friends: arrayUnion(fromUserId)
    });

    console.log('Friend request accepted!');
  } catch (error) {
    console.error('Error accepting friend request:', error);
  }
}


export async function rejectFriendRequest(reqId) {
  try {
    const reqRef = doc(db, 'friendRequests', reqId);
    await updateDoc(reqRef, { status: 'rejected' });
    console.log('Friend request rejected');
  } catch (error) {
    console.error('Error rejecting friend request:', error);
  }
}

export function listenIncomingRequests(currentUserId, setRequests) {
  if (!currentUserId) return () => {};

  const ref = collection(db, 'friendRequests');
  const q = query(ref, where('to', '==', currentUserId), where('status', '==', 'pending'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const incoming = [];
    snapshot.forEach((docSnap) => {
      incoming.push({ id: docSnap.id, ...docSnap.data() });
    });
    setRequests(incoming);
  });

  return unsubscribe;
}


export async function fetchUserFriends(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return [];
    const data = snap.data();
    return data.friends || [];
  } catch (err) {
    console.error('Error fetching user friends:', err);
    return [];
  }
}

export async function removeFriend(currentUserId, friendId) {
  try {
    const userRef = doc(db, 'users', currentUserId);
    const friendDoc = await getDoc(userRef);
    if (!friendDoc.exists()) return;

    const oldFriends = friendDoc.data().friends || [];
    const newFriends = oldFriends.filter(id => id !== friendId);

    await updateDoc(userRef, {
      friends: newFriends
    });

    console.log('Unfriended user:', friendId);
  } catch (error) {
    console.error('Error removing friend:', error);
  }
}
