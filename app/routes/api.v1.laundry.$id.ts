import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { getClient, initializeClient } from "~/db/client.server";
import { pushMessage } from "~/firebase/messageServices.server";
import { getServiceAccount } from "~/firebase/serviceAccount.server";
import { getLaundryById, updateLaundry } from "~/models/laundry.server";
import { Notification } from "~/firebase/messageServices.server";
import {
  deleteUseById,
  getUseByLaundryId,
  updateUse,
} from "~/models/use.server";

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
    const use = await getClient().query.uses.findFirst({
      where: (use, { eq }) => eq(use.laundryId, laundryId),
      with: { account: true },
    });
    if (use == null) {
      return json({}, 200);
    }

    await updateUse({ id: use.id, endAt: new Date() });

    if (use.account?.messageToken == null) {
      return json({}, 200);
    }

    const notification: Notification = {
      title: "洗濯完了のお知らせ",
      body: `${laundry.room?.place}の洗濯機の洗濯が完了しました！`,
      link: `/wash/complete/${laundry.id}`,
    };
    await pushMessage(use.account.messageToken, notification, {
      projectId: env.FIREBASE_PROJECT_ID,
      serviceAccount: getServiceAccount(env),
    });
  }

  // 洗濯開始
  if (!laundry.running && result.running) {
    const use = await getUseByLaundryId(laundry.id);
    if (use?.endAt) {
      await deleteUseById(use.id);
    } else if (use) {
      return json({}, 423);
    }

    if (use?.account?.messageToken) {
      await pushMessage(
        use.account.messageToken,
        {
          title: "洗濯回収のお知らせ",
          body: `${laundry.room?.place}の洗濯機で、あなたの洗濯物が取り出されたようです。`,
        },
        {
          projectId: env.FIREBASE_PROJECT_ID,
          serviceAccount: getServiceAccount(env),
        }
      );
    }
  }

  return json({}, 200);
};
