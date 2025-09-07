import { initializeApp } from "firebase/app";
import {
  getAuth,
  FacebookAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAa3aszh3aMG0pXMOpjt6nGDXUDYqqX1Ow",
  authDomain: "instagram-clone-11696.firebaseapp.com",
  projectId: "instagram-clone-11696",
  storageBucket: "instagram-clone-11696.firebasestorage.app",
  messagingSenderId: "653956392218",
  appId: "1:653956392218:web:c12dc6c9731f5cc8d2b8a3",
  measurementId: "G-95FEVCHZ18",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new FacebookAuthProvider();
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithRedirect(auth, provider);
    return result.user;
  } catch (err) {
    console.error("Facebook login error:", err);
    throw err;
  }
};

export { auth, db };
