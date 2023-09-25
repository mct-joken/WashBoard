import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { pushMessage } from "~/firebase/messageServices.server";
import { getServiceAccount } from "~/firebase/serviceAccount.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = () => null;

export type NotificationSendAPI = {
  to: string;
  notificationTitle: string;
  notificationBody: string;
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const env = context.env as Env;
  const formData = await request.formData();
  const get = formDataGetter<NotificationSendAPI>(formData);

  const to = get("to");
  const title = get("notificationTitle");
  const body = get("notificationBody");

  if (!isString(to) || !isString(title) || !isString(body)) {
    return json({}, 400);
  }

  const response = await pushMessage(
    to,
    { title, body },
    {
      projectId: env.FIREBASE_PROJECT_ID,
      serviceAccount: getServiceAccount(env),
    }
  );
  return new Response(response.body, response);
};
