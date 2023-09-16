import { LoaderArgs, json, redirect } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Menu from "~/components/menu";
import { requestToken } from "~/firebase/messageServices.client";
import { getAccountByEmail } from "~/models/account.server";
import { action as subscribeNotificationAction } from "~/routes/api.v1.notification.subscribe";
import { action as sendNotificationAction } from "~/routes/api.v1.notification.send";

export const loader = async ({ context }: LoaderArgs) => {
  const env = context.env as Env;
  const account = await getAccountByEmail(context, "alice@example.com");
  if (account == null) {
    return redirect("/home");
  }

  return json({ context, env, account });
};

const NotificationTest = () => {
  const { env, account } = useLoaderData<typeof loader>();
  const [currentAccount, setCurrentAccount] = useState(account);
  const setMessageToken = useFetcher<typeof subscribeNotificationAction>();
  const sendNotification = useFetcher<typeof sendNotificationAction>();

  const onSubscribe = async () => {
    const token = await requestToken(env.FIREBASE_VAPID_SERVER_KEY);
    if (currentAccount?.messageToken === token) {
      return;
    }

    setMessageToken.submit(
      {
        accountId: currentAccount.id,
        messageToken: token,
      },
      { action: "/api/v1/notification/subscribe", method: "POST" }
    );
  };

  const onSend = async () => {
    if (currentAccount.messageToken == null) {
      return;
    }

    sendNotification.submit(
      {
        to: currentAccount.messageToken,
        notificationTitle: "Test",
        notificationBody: "Notification",
      },
      { action: "/api/v1/notification/send", method: "POST" }
    );
  };

  useEffect(() => {
    if (!setMessageToken.data) return;
    setCurrentAccount(setMessageToken.data);
  }, [setMessageToken.data]);

  useEffect(() => {
    console.log(sendNotification.data);
  }, [sendNotification.data]);

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
