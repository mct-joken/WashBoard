import { useLocation, useNavigate } from "@remix-run/react";
import { signInWithGoogle } from "~/firebase/authServices.client";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "~/hooks/useAuth";
import { useEffect } from "react";
import { Spinner } from "~/components/spinner";
import appBanner from "public/washboard-app.png";

const Signin = (): React.ReactElement => {
  const { state } = useLocation();
  const to =
    state?.redirectTo == null || state.redirectTo == "/signin"
      ? "/home"
      : state.redirectTo;
  const { ready, user } = useAuth({ behavior: "AutoSignup" });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(to);
    }
  }, [ready, user]);

  return (
    <div
      className="
        h-screen
        flex flex-col justify-center items-center gap-9
      "
    >
      <img src={appBanner} className="w-72" alt="WashBoard" />
      {!ready || user != null ? (
        <Spinner />
      ) : (
        <button
          type="button"
          onClick={signInWithGoogle}
          className="
            mb-1 px-4 py-1
            border border-gray-300 rounded shadow-md
            bg-white hover:bg-gray-100 active:bg-gray-300
            flex font-semibold items-center justify-between gap-2
          "
        >
          <FcGoogle size={35} /> Googleでログイン
        </button>
      )}
    </div>
  );
};

export default Signin;
