import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  Unsubscribe,
} from "firebase/auth";
import { FirebaseAuth } from "./config";
import React from "react";

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
type StateDispatch = React.Dispatch<React.SetStateAction<any>>;

export const onAuthStateHasChanged = (setSession: StateDispatch): Unsubscribe => {
  const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
    if (!user) return setSession({ status: "no-authenticated", userId: null });
    setSession({ status: "authenticated", userId: user!.uid });
  });
  return unsubscribe;
};

export const logoutFirebase = async () => await FirebaseAuth.signOut();
