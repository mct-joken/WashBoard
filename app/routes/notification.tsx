import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Menu from "~/components/menu";
import { requestToken } from "~/firebase/messageServices.client";
import type {
  NotificationSubscribeAPI,
  action as subscribeNotificationAction,
} from "~/routes/resources.notification.subscribe";
import type {
  NotificationSendAPI,
  action as sendNotificationAction,
} from "~/routes/resources.notification.send";
import { fetcherSubmitter } from "~/utils/fetcherSubmitter";
import { useAuth } from "~/hooks/useAuth";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.env as Env;

  return json({ vapidServerKey: env.FIREBASE_VAPID_SERVER_KEY });
};

const NotificationTest = () => {
  const { user } = useAuth();
  const { vapidServerKey } = useLoaderData<typeof loader>();
  const [currentToken, setCurrentToken] = useState<string>();
  const subscribeFetcher = useFetcher<typeof subscribeNotificationAction>();
  const sendFetcher = useFetcher<typeof sendNotificationAction>();
  const submitSubscribe = fetcherSubmitter<NotificationSubscribeAPI>(
    subscribeFetcher,
    "/resources/notification/subscribe",
    "POST"
  );
  const submitSend = fetcherSubmitter<NotificationSendAPI>(
    sendFetcher,
    "/resources/notification/send",
    "POST"
  );

  const onSubscribe = async () => {
    const token = await requestToken(vapidServerKey);
    if (currentToken === token || token == null || user?.email == null) {
      return;
    }

    submitSubscribe({
      accountEmail: user.email,
      messageToken: token,
    });
  };

  const onSend = async () => {
    if (user?.email == null) {
      return;
    }

    submitSend({
      accountEmail: user.email,
      notificationTitle: "Test",
      notificationBody: "Notification",
    });
  };

  useEffect(() => {
    if (subscribeFetcher.data?.messageToken == null) return;
    setCurrentToken(subscribeFetcher.data.messageToken);
  }, [subscribeFetcher.data]);

  return (
    <>
      <div className="p-3">
        <button
          onClick={onSubscribe}
          className="
            m-2 p-2 border rounded
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
            m-2 p-2 border rounded
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
