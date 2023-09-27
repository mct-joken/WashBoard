import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "@remix-run/react";

export const useRequireAuth = (redirectTo: string) => {
  const { ready, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (user == null) {
      navigate("/signin", { state: { redirectTo } });
    }
  }, [ready, user]);

  return { ready, user };
};
