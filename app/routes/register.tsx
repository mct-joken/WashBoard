import { Login } from "~/components/login";
import Menu from "~/components/menu";
import { signOutFirebase } from "~/firebase/authServices.client";
import { useAuth } from "~/hooks/useAuth";

const Register = () => {
  const { ready, user } = useAuth({ behavior: "AutoSignup" });

  if (!ready) {
    return <>Now loading</>;
  }

  return (
    <>
      {user == null ? (
        <Login />
      ) : (
        <>
          <p>{user.email}</p>
          <button
            onClick={signOutFirebase}
            className="
              m-4 px-4 py-2 rounded
              border border-gray-400
              hover:bg-slate-100 active:bg-slate-300
            "
          >
            ログアウト
          </button>
        </>
      )}
      <Menu />
    </>
  );
};

export default Register;
