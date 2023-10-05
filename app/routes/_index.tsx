import { redirect, MetaFunction } from "@remix-run/cloudflare";
export const meta: MetaFunction = () => {
  return [
    { title: "WashBoard" },
    { name: "description", content: "WashBoard" },
  ];
};
export const loader = () => {
  return redirect("/signin");
};

export default function Index() {
  return <></>;
}
