import React, { useContext } from "react";
import Menu from "./menu";
import { AuthContext } from "~/context/authContext";
import { Login } from "~/components/login";
const Wash = () => {
  const { status, userId } = useContext(AuthContext);
  if (status === "checking") return <div>Checking...</div>;
  if (status === "authenticated" && userId) {
    console.log("userId: ", userId);
    console.log("status: ", status);
    return (
      <div>
        <h1>Wash Page</h1>
        <Menu />
      </div>
    );
  }
  return (
    <>
      <Login />
      <Menu />
    </>
  );
};

export default Wash;
