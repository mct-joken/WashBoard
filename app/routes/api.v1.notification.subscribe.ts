import { ActionArgs } from "@remix-run/cloudflare";
import { updateAccount } from "~/models/account.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = () => null;

export type NotificationSubscribeAPI = {
  accountId: string;
  messageToken: string;
};

export const action = async ({ request, context }: ActionArgs) => {
  const formData = await request.formData();
  const get = formDataGetter<NotificationSubscribeAPI>(formData);

  const accountId = get("accountId");
  const messageToken = get("messageToken");

  if (!isString(accountId) || !isString(messageToken)) {
    return null;
  }

  return await updateAccount(context, { id: accountId, messageToken });
};
