import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { createAccount, getAccountByEmail } from "~/models/account.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = () => null;

type AccountRegisterAPI = {
  email: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const get = formDataGetter<AccountRegisterAPI>(formData);
  const email = get("email");
  if (!isString(email)) {
    return json({}, 400);
  }

  const account =
    (await getAccountByEmail(email)) ??
    (await createAccount(email).catch(() => null));
  if (account == null) {
    return json({}, 500);
  }

  return json({ valid: true }, 200);
};
