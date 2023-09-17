import { User, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuth = (): { ready: boolean; user: User | null } => {
  const auth = getAuth();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      await auth.authStateReady();
      setReady(true);
    })();
    return auth.onAuthStateChanged(setUser);
  }, [auth]);

  return { ready, user };
};
