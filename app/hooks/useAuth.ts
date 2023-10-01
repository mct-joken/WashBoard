import { Unsubscribe, User, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { form } from "~/utils/form";

type AuthConfig = {
  behavior?: "RejectAnonymous" | "AutoSignup";
};

/**
 * 現在の認証状態をリッスンして返すフック
 * @param config 認証の設定
 * @returns \{`ready`: Firebase authの初期化が完了したか, `user`: ログイン中のユーザ \}
 */
export const useAuth = (
  config?: AuthConfig
): { ready: boolean; user: User | null } => {
  const auth = getAuth();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const beforeAuth = async (user: User | null) => {
      if (user == null) {
        return;
      }
      if (user.email == null) {
        throw new Error("Authentication rejected");
      }
      if (config?.behavior === "RejectAnonymous") {
        verifyAccount(user.email);
      } else if (config?.behavior === "AutoSignup") {
        registerAccount(user.email);
      }
    };

    const verifyAccount = async (email: string) => {
      const response = await fetch("/resources/account/verify", {
        method: "POST",
        body: form({ email }),
      });
      const data = await response.json<{ valid: boolean }>().catch(() => null);
      if (!response.ok || !data?.valid) {
        throw new Error("Authentication rejected");
      }
    };

    const registerAccount = async (email: string) => {
      const response = await fetch("/resources/account/register", {
        method: "POST",
        body: form({ email }),
      });
      const data = await response.json<{ valid?: boolean }>().catch(() => null);
      if (!response.ok || !data?.valid) {
        throw new Error("Authentication rejected");
      }
    };

    auth.authStateReady().then(() => setReady(true));
    const unsubscribes: Unsubscribe[] = [
      auth.onAuthStateChanged(setUser),
      auth.beforeAuthStateChanged(beforeAuth),
    ];

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [auth, config]);

  return { ready, user };
};
