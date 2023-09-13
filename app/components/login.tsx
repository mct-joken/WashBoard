import React, { useContext } from "react";
import { AuthContext } from "~/context/authContext";
import Google from "../../public/google.png";

export const Login = () => {
  const { handleLoginWithGoogle } = useContext(AuthContext);
  return (
      <div className={"m-5"}>
        <p>このページはログインが必要です。</p>
        <div className={"flex justify-center m-5"}>
        <button
            type={"button"}
            onClick={handleLoginWithGoogle}
            className={"h-12 flex bg-white font-semibold py-2 px-4 border border-gray-400 shadow items-center justify-between rounded"}
        >
          <img src={Google} alt={"google"} className={"h-10 rounded-full"} />
          Googleでログイン
        </button>
        </div>
      </div>
  );
}