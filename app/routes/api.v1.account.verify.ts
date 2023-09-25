import { ActionArgs, json } from "@remix-run/cloudflare";
import { getAccountByEmail } from "~/models/account.server";

export const loader = () => null;

export const action = async ({ request, context }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  if (typeof email !== "string") {
    return json({}, 400);
  }

  const account = await getAccountByEmail(context, email);
  if (account == null) {
    return json({ valid: false });
  }

  return json({ valid: true });
};
