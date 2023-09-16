import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  Unsubscribe,
  getAuth,
} from "firebase/auth";
import React from "react";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(getAuth(), googleProvider);
    return result.user;
  } catch (e) {
    alert((e as Error).message);
  }
};
type StateDispatch = React.Dispatch<React.SetStateAction<any>>;

export const onAuthStateHasChanged = (
  setSession: StateDispatch
): Unsubscribe => {
  const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
    if (!user)
      return setSession({
        status: "no-authenticated",
        userId: null,
        email: null,
      });
    setSession({
      status: "authenticated",
      userId: user!.uid,
      email: user!.email,
    });
  });
  return unsubscribe;
};

export const logoutFirebase = async () => await getAuth().signOut();
