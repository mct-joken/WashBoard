import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { FirebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(FirebaseAuth, googleProvider);

    const { uid } = result.user;

    return uid;
  } catch (e) {
    alert((e as Error).message);
  }
};
type StateDispatch = any;

export const onAuthStateHasChanged = (setSession: StateDispatch) => {
  onAuthStateChanged(FirebaseAuth, (user) => {
    if (!user) return setSession({ status: "no-authenticated", userId: null });
    setSession({ status: "authenticated", userId: user!.uid });
  });
};

export const logoutFirebase = async () => await FirebaseAuth.signOut();
