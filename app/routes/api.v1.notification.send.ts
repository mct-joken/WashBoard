import { ActionArgs, json } from "@remix-run/cloudflare";
import { pushMessage } from "~/firebase/messageServices.server";
import { getServiceAccount } from "~/firebase/serviceAccount.server";

export const loader = () => null;

export const action = async ({ request, context }: ActionArgs) => {
  const env = context.env as Env;
  const formData = await request.formData();
  const to = formData.get("to");
  const title = formData.get("notificationTitle");
  const body = formData.get("notificationBody");
  const isString = (value: any): value is string => typeof value === "string";

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
