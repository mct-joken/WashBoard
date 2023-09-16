import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import {
  logoutFirebase,
  onAuthStateHasChanged,
  signInWithGoogle,
} from "~/firebase/authServices.client";

export interface AuthStateContext {
  userId: string | null;
  email: string | null;
  status: "checking" | "authenticated" | "no-authenticated";
  handleLoginWithGoogle: () => Promise<void>;
  handleLogOut: () => Promise<void>;
}

const initialState: Pick<AuthStateContext, "status" | "userId" | "email"> = {
  status: "checking",
  userId: null,
  email: null,
};

export const AuthContext = createContext(initialState as AuthStateContext);

interface IElement {
  children: ReactNode;
}

export const AuthProvider = ({ children }: IElement) => {
  const [session, setSession] = useState(initialState);
  useEffect(() => {
    return onAuthStateHasChanged(setSession);
  }, []);
  const handleLogOut = async () => {
    logoutFirebase();
    setSession({ userId: null, email: null, status: "no-authenticated" });
  };

  type User = {
    uid: string | null;
    email: string | null;
  };
  const validateAuth = (user: User | undefined) => {
    if (user) {
      setSession({
        userId: user.uid,
        email: user.email,
        status: "authenticated",
      });
    } else {
      handleLogOut();
    }
  };
  const checking = () =>
    setSession((prev) => ({ ...prev, status: "checking" }));

  const handleLoginWithGoogle = async () => {
    checking();
    const user = await signInWithGoogle();
    validateAuth(user);
  };

  return (
    <AuthContext.Provider
      value={{
        ...session,
        handleLoginWithGoogle,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
