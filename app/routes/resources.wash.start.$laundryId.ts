import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { desc } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import { pushMessage } from "~/firebase/messageServices.server";
import { getServiceAccount } from "~/firebase/serviceAccount.server";
import { getAccountByEmail } from "~/models/account.server";
import { createUse } from "~/models/use.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  type WashStartAPI = {
    accountEmail: string;
    forgetting?: string;
  };

  const env = context.env as Env;
  const formData = await request.formData();
  const get = formDataGetter<WashStartAPI>(formData);
  const laundryId = params.laundryId;
  const accountEmail = get("accountEmail");
  const forgetting = get("forgetting");

  if (!isString(laundryId) || !isString(accountEmail)) {
    return json({ error: true }, 400);
  }

  const laundry = await getClient().query.laundries.findFirst({
    where: (laundry, { eq }) => eq(laundry.id, laundryId),
    with: { use: true, room: true },
  });
  const account = await getAccountByEmail(accountEmail);

  if (laundry == null || account == null) {
    return json({ error: true }, 404);
  }
  if (laundry.use != null && laundry.use.endAt == null) {
    return json({ error: true }, 423);
  }

  const use = await createUse(account.id, laundry.id);
  if (use == null) {
    return json({ error: true }, 500);
  }

  if (forgetting === "on") {
    const prevUse = await getClient().query.useHistories.findFirst({
      where: (useHistory, { eq }) => eq(useHistory.laundryId, laundryId),
      orderBy: (useHistory) => desc(useHistory.endAt),
      with: {
        account: true,
      },
    });
    if (prevUse?.account?.messageToken == null) {
      return json({ error: false }, 200);
    }

    // `fetch`が使用できない(原因不明)ため`pushMessage`を直接呼び出す
    await pushMessage(
      prevUse.account.messageToken,
      {
        title: "取り忘れのお知らせ",
        body: `${laundry.room?.place}の洗濯機で、洗濯物を取り忘れているようです。`,
      },
      {
        projectId: env.FIREBASE_PROJECT_ID,
        serviceAccount: getServiceAccount(env),
      }
    );
  }

  return redirect("/home");
};
