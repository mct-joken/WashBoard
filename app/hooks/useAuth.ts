import { Unsubscribe, User, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

/**
 * 現在の認証状態をリッスンして返すフック
 * @param enableVerification 存在するAccountのログインのみ受け付けるか
 * @returns \{`ready`: Firebase authの初期化が完了したか, `user`: ログイン中のユーザ \}
 */
export const useAuth = (
  enableVerification: boolean = false
): { ready: boolean; user: User | null } => {
  const auth = getAuth();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const verifyAuth = async (user: User | null) => {
    if (user == null) {
      return;
    }
    if (user.email == null) {
      throw new Error("Authentication rejected");
    }

    const form = new FormData();
    form.append("email", user.email);
    const response = await fetch("/api/v1/account/verify", {
      method: "POST",
      body: form,
    });
    const data = (await response.json()) as { valid: boolean };
    if (!data.valid) {
      throw new Error("Authentication rejected");
    }
  };

  useEffect(() => {
    const unsubscribes: Unsubscribe[] = [];
    auth.authStateReady().then(() => setReady(true));
    unsubscribes.push(auth.onAuthStateChanged(setUser));
    if (enableVerification) {
      unsubscribes.push(auth.beforeAuthStateChanged(verifyAuth));
    }
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [auth]);

  return { ready, user };
};
