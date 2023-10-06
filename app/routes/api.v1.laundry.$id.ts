import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { isNotNull, isNull } from "drizzle-orm";
import { getClient, initializeClient } from "~/db/client.server";
import {
  pushMessage,
  Notification,
  MessageConfig,
} from "~/firebase/messageServices.server";
import { getServiceAccount } from "~/firebase/serviceAccount.server";
import { getLaundryById, updateLaundry } from "~/models/laundry.server";
import { updateUse } from "~/models/use.server";

type LaundryStatusAPI = {
  status: string;
};

type LaundryStatus = {
  running: boolean;
};

export const action = async ({
  params,
  request,
  context,
}: ActionFunctionArgs) => {
  // `PUT`以外を許可しない
  if (request.method !== "PUT") {
    return json({}, 405);
  }

  initializeClient(context);
  const env = context.env as Env;
  const laundryId = params.id;
  const messageConfig: MessageConfig = {
    projectId: env.FIREBASE_PROJECT_ID,
    serviceAccount: getServiceAccount(env),
  };

  if (laundryId == null) {
    return json({}, 400);
  }

  const laundry = await getLaundryById(laundryId);
  if (laundry == null) {
    return json({}, 404);
  }

  const body = await request.json<LaundryStatusAPI>().catch(() => null);
  if (body == null || (body.status !== "true" && body.status !== "false")) {
    return json({}, 400);
  }

  const laundryStatus: LaundryStatus = { running: body.status === "true" };

  const result = await updateLaundry({
    id: laundryId,
    running: laundryStatus.running,
  });
  if (result == null) {
    return json({}, 500);
  }

  // 洗濯終了
  if (laundry.running && !result.running) {
    const uses = await getClient().query.uses.findMany({
      where: (use, { eq, and }) =>
        and(eq(use.laundryId, laundryId), isNull(use.endAt)),
      with: { account: true },
    });
    if (uses.length == 0) {
      return json({}, 200);
    }
    if (uses.length >= 2) {
      return json({}, 500);
    }

    const use = uses[0];

    await updateUse({ id: use.id, endAt: new Date() });

    if (use.account?.messageToken == null) {
      return json({}, 200);
    }

    const notification: Notification = {
      title: "洗濯完了のお知らせ",
      body: `${laundry.room?.place}の洗濯機の洗濯が完了しました！`,
      link: `/wash/complete/${laundry.id}`,
    };
    await pushMessage(use.account.messageToken, notification, messageConfig);
  }

  // 洗濯開始
  if (!laundry.running && result.running) {
    const uses = await getClient().query.uses.findMany({
      where: (use, { eq, and }) =>
        and(eq(use.laundryId, laundryId), isNotNull(use.endAt)),
      with: { account: true },
    });

    uses.forEach(async (use) => {
      if (use?.account?.messageToken == null) {
        return;
      }

      const notification: Notification = {
        title: "未回収の洗濯物のお知らせ",
        body: `${laundry.room
          ?.place}の洗濯室で、${use.endAt?.toLocaleString()}から回収していない洗濯物があります。`,
      };

      await pushMessage(use.account.messageToken, notification, messageConfig);
    });
  }

  return json({}, 200);
};
