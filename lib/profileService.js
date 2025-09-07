import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase.js";

export const getProfileByUid = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const followUser = async ({ currentUid, targetUid }) => {
  await updateDoc(doc(db, "users", currentUid), {
    following: arrayUnion(targetUid),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "users", targetUid), {
    followers: arrayUnion(currentUid),
    updatedAt: serverTimestamp(),
  });
};

export const unfollowUser = async ({ currentUid, targetUid }) => {
  await updateDoc(doc(db, "users", currentUid), {
    following: arrayRemove(targetUid),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "users", targetUid), {
    followers: arrayRemove(currentUid),
    updatedAt: serverTimestamp(),
  });
};
