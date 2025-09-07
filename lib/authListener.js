import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { login, logout } from "@/redux/userSlice";
import { getUser } from "@/lib/userServices";
import { store } from "@/redux/store";

export const listenAuthchanges = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getUser(user.uid);
      store.dispatch(
        login(profile || { uid: user.uid, email: user.email, username: null })
      );
    } else {
      store.dispatch(logout());
    }
  });
};
