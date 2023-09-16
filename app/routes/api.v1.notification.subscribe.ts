import { ActionArgs, json } from "@remix-run/cloudflare";
import { updateAccount } from "~/models/account.server";

export const loader = () => null;

export const action = async ({ request, context }: ActionArgs) => {
  const formData = await request.formData();
  const accountId = formData.get("accountId");
  const messageToken = formData.get("messageToken");
  if (typeof accountId !== "string" || typeof messageToken !== "string") {
    return null;
  }

  return await updateAccount(context, { id: accountId, messageToken });
};
