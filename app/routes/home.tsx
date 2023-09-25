// home.tsx
import { Link } from "@remix-run/react";
import Menu from "~/components/menu";
const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/wash/complete/2OUBTjiN9aJyTIJpqfdRc" className="underline">
        回収
      </Link>
      <Menu />
    </div>
  );
};

export default Home;
