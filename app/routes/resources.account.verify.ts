import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { getAccountByEmail } from "~/models/account.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = () => null;

export type AccountVerifyAPI = {
  email: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const get = formDataGetter<AccountVerifyAPI>(formData);
  const email = get("email");
  if (!isString(email)) {
    return json({}, 400);
  }

  const account = await getAccountByEmail(email);
  if (account == null) {
    return json({ valid: false });
  }

  return json({ valid: true });
};
