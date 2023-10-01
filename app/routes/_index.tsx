import type { MetaFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
export const meta: MetaFunction = () => {
  return [
    { title: "Washboard" },
    { name: "description", content: "Washboard" },
  ];
};
export const loader = () => {
  return redirect("/signin");
};

export default function Index() {
  return <></>;
}
