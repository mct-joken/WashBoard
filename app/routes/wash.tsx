import Menu from "~/components/menu";
import { Login } from "~/components/login";
import { useAuth } from "~/hooks/useAuth";

const Wash = () => {
  const { ready, user } = useAuth();

  if (!ready) {
    return <>Checking...</>;
  }
  return (
    <>
      {user ? <h1>Wash Page</h1> : <Login />}
      <Menu />
    </>
  );
};

export default Wash;
