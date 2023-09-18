import { LoaderArgs, json, redirect } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Menu from "~/components/menu";
import { requestToken } from "~/firebase/messageServices.client";
import { getAccountByEmail } from "~/models/account.server";
import {
  NotificationSubscribeAPI,
  action as subscribeNotificationAction,
} from "~/routes/api.v1.notification.subscribe";
import {
  NotificationSendAPI,
  action as sendNotificationAction,
} from "~/routes/api.v1.notification.send";
import { fetcherSubmitter } from "~/utils/fetcherSubmitter";

export const loader = async ({ context }: LoaderArgs) => {
  const env = context.env as Env;
  const account = await getAccountByEmail("alice@example.com");
  if (account == null) {
    return redirect("/home");
  }

  return json({ context, env, account });
};

const NotificationTest = () => {
  const { env, account } = useLoaderData<typeof loader>();
  const [currentAccount, setCurrentAccount] = useState(account);
  const subscribeFetcher = useFetcher<typeof subscribeNotificationAction>();
  const sendFetcher = useFetcher<typeof sendNotificationAction>();
  const submitSubscribe = fetcherSubmitter<NotificationSubscribeAPI>(
    subscribeFetcher,
    "/api/v1/notification/subscribe",
    "POST"
  );
  const submitSend = fetcherSubmitter<NotificationSendAPI>(
    sendFetcher,
    "/api/v1/notification/send",
    "POST"
  );

  const onSubscribe = async () => {
    const token = await requestToken(env.FIREBASE_VAPID_SERVER_KEY);
    if (currentAccount?.messageToken === token || token === null) {
      return;
    }

    submitSubscribe({
      accountId: currentAccount.id,
      messageToken: token,
    });
  };

  const onSend = async () => {
    if (currentAccount.messageToken == null) {
      return;
    }

    submitSend({
      to: currentAccount.messageToken,
      notificationTitle: "Test",
      notificationBody: "Notification",
    });
  };

  useEffect(() => {
    if (!subscribeFetcher.data) return;
    setCurrentAccount(subscribeFetcher.data);
  }, [subscribeFetcher.data]);

  return (
    <>
      <div className="p-3">
        <button
          onClick={onSubscribe}
          className="
            m-2 p-2 border rounded-lg
            shadow
            hover:bg-gray-300
            active:bg-slate-500 active:text-white active:shadow-none
          "
        >
          Subscribe notification
        </button>
        <button
          onClick={onSend}
          className="
            m-2 p-2 border rounded-lg
            shadow
            hover:bg-gray-300
            active:bg-slate-500 active:text-white active:shadow-none
          "
        >
          Send notification
        </button>
      </div>
      <Menu />
    </>
  );
};

export default NotificationTest;
