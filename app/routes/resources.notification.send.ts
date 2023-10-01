import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { pushMessage } from "~/firebase/messageServices.server";
import { getServiceAccount } from "~/firebase/serviceAccount.server";
import { getAccountByEmail } from "~/models/account.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = () => null;

export type NotificationSendAPI = {
  accountEmail: string;
  notificationTitle: string;
  notificationBody: string;
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const env = context.env as Env;
  const formData = await request.formData();
  const get = formDataGetter<NotificationSendAPI>(formData);

  const accountEmail = get("accountEmail");
  const title = get("notificationTitle");
  const body = get("notificationBody");

  if (!isString(accountEmail) || !isString(title) || !isString(body)) {
    return json({}, 400);
  }

  const account = await getAccountByEmail(accountEmail);
  if (account?.messageToken == null) {
    return json({}, 404);
  }

  const response = await pushMessage(
    account.messageToken,
    { title, body },
    {
      projectId: env.FIREBASE_PROJECT_ID,
      serviceAccount: getServiceAccount(env),
    }
  );
  return new Response(response.body, response);
};
