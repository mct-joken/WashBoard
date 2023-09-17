import { redirect, type V2_MetaFunction } from "@remix-run/cloudflare";
export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader = () => {
  return redirect("/home");
}
export default function Index() {
  return (
    <></>
  );
}
