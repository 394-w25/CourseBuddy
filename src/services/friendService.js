import { db } from '../utilities/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  where,
  serverTimestamp,
  getDocs,
  orderBy,
  query,
  startAt,
  endAt,
  getDoc
} from 'firebase/firestore';

export async function searchUsersInFirestore(searchTerm) {
  if (!searchTerm) return [];
  const results = [];
  const usersRef = collection(db, 'users');

  const q1 = query(
    usersRef,
    orderBy('displayName'),
    startAt(searchTerm),
    endAt(searchTerm + '\uf8ff')
  );
  const snap1 = await getDocs(q1);
  snap1.forEach((d) => {
    results.push({ id: d.id, ...d.data() });
  });

  const q2 = query(
    usersRef,
    orderBy('email'),
    startAt(searchTerm),
    endAt(searchTerm + '\uf8ff')
  );
  const snap2 = await getDocs(q2);
  snap2.forEach((d) => {
    if (!results.find((r) => r.id === d.id)) {
      results.push({ id: d.id, ...d.data() });
    }
  });

  return results;
}

export async function sendFriendRequest(fromUid, toUid) {
  const existing = await findPendingRequestDoc(fromUid, toUid);
  if (existing) return existing.docId || null;
  const ref = collection(db, 'friendRequests');
  const docRef = await addDoc(ref, {
    from: fromUid,
    to: toUid,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function cancelFriendRequestIfPending(docId) {
  const reqRef = doc(db, 'friendRequests', docId);
  const snap = await getDoc(reqRef);
  if (!snap.exists()) return;
  const data = snap.data();
  if (data.status === 'pending') {
    await updateDoc(reqRef, { status: 'cancelled' });
  }
}

export async function acceptFriendRequest(reqId, fromUid, toUid) {
  const reqRef = doc(db, 'friendRequests', reqId);
  await updateDoc(reqRef, { status: 'accepted' });
  const fromDoc = doc(db, 'users', fromUid);
  const toDoc = doc(db, 'users', toUid);
  await updateDoc(fromDoc, { friends: arrayUnion(toUid) });
  await updateDoc(toDoc, { friends: arrayUnion(fromUid) });
}

export async function rejectFriendRequest(reqId) {
  const reqRef = doc(db, 'friendRequests', reqId);
  await updateDoc(reqRef, { status: 'rejected' });
}

export function listenIncomingRequests(uid, callback) {
  if (!uid) return () => {};
  const ref = collection(db, 'friendRequests');
  const q = query(ref, where('to', '==', uid), where('status', '==', 'pending'));
  const unsub = onSnapshot(q, (snap) => {
    const arr = [];
    snap.forEach((ds) => arr.push({ id: ds.id, ...ds.data() }));
    callback(arr);
  });
  return unsub;
}

export async function fetchUserFriends(uid) {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return [];
  const data = snap.data();
  return data.friends || [];
}

export async function removeFriend(currentUid, friendUid) {
  const curRef = doc(db, 'users', currentUid);
  const frRef = doc(db, 'users', friendUid);

  const [curSnap, frSnap] = await Promise.all([getDoc(curRef), getDoc(frRef)]);
  if (!curSnap.exists() || !frSnap.exists()) return;

  const curData = curSnap.data();
  const frData = frSnap.data();

  const curOldFriends = curData.friends || [];
  const frOldFriends = frData.friends || [];

  const curUpdated = curOldFriends.filter((id) => id !== friendUid);
  const frUpdated = frOldFriends.filter((id) => id !== currentUid);

  await Promise.all([
    updateDoc(curRef, { friends: curUpdated }),
    updateDoc(frRef, { friends: frUpdated }),
  ]);
}

export async function findPendingRequestDoc(fromUid, toUid) {
  const ref = collection(db, 'friendRequests');
  const q = query(
    ref,
    where('from', '==', fromUid),
    where('to', '==', toUid),
    where('status', '==', 'pending')
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const ds = snap.docs[0];
  return { docId: ds.id, ...ds.data() };
}
