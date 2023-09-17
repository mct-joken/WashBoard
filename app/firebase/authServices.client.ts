import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(getAuth(), googleProvider);
    return result.user;
  } catch (e) {
    alert((e as Error).message);
  }
};

export const signOutFirebase = async () => await getAuth().signOut();
