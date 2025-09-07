import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

//create new user in firestore
export const createUser = async (user, username) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    username,
    fullName: user.displayName || "",
    email: user.email || "",
    profilePic: user.photoURL || "",
    bio: "",
    followers: [],
    following: [],
    createdAt: serverTimestamp(),
    updateDoc: serverTimestamp(),
  });
};

//get user from firestore
export const getUser = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

//update user in firestore
export const updateUser = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { ...data, updateDoc: serverTimestamp() });
};
