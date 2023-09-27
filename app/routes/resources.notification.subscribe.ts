import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getAccountByEmail, updateAccount } from "~/models/account.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = () => null;

export type NotificationSubscribeAPI = {
  accountEmail: string;
  messageToken: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const get = formDataGetter<NotificationSubscribeAPI>(formData);

  const accountEmail = get("accountEmail");
  const messageToken = get("messageToken");

  if (!isString(accountEmail) || !isString(messageToken)) {
    return null;
  }

  const account = await getAccountByEmail(accountEmail);

  if (account == null) {
    return null;
  }

  return await updateAccount({ id: account.id, messageToken });
};
