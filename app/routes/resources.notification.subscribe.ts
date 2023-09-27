import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import { accounts } from "~/db/schema";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = () => null;

export type NotificationSubscribeAPI = {
  accountEmail: string;
  messageToken: string;
};

export type NotificationSubscribeAPIResponse = {
  messageToken?: string;
};

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<
  TypedResponse<NotificationSubscribeAPIResponse>
> => {
  const formData = await request.formData();
  const get = formDataGetter<NotificationSubscribeAPI>(formData);

  const accountEmail = get("accountEmail");
  const messageToken = get("messageToken");

  if (!isString(accountEmail) || !isString(messageToken)) {
    return json({}, 400);
  }

  const result = await getClient()
    .update(accounts)
    .set({ messageToken: messageToken, updatedAt: new Date() })
    .where(eq(accounts.email, accountEmail))
    .returning()
    .get();
  if (result?.messageToken == null) {
    return json({}, 500);
  }
  return json({ messageToken: result.messageToken }, 200);
};
