import { useFetcher, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  onMessageListener,
  requestToken,
} from "~/firebase/messageServices.client";
import {
  action as subscribeNotificationAction,
  NotificationSubscribeAPI,
} from "~/routes/resources.notification.subscribe";
import { fetcherSubmitter } from "~/utils/fetcherSubmitter";

export const useNotification = (
  vapidServerKey: string,
  accountEmail?: string | null
) => {
  const [notification, setNotification] = useState<{
    title: string | undefined;
    body: string | undefined;
  }>();
  const { pathname } = useLocation();
  const subscribeFetcher = useFetcher<typeof subscribeNotificationAction>();
  const [currentAccount, setCurrentAccount] =
    useState<NonNullable<typeof subscribeFetcher.data>>();
  const submitSubscribe = fetcherSubmitter<NotificationSubscribeAPI>(
    subscribeFetcher,
    "/resources/notification/subscribe",
    "POST"
  );

  useEffect(() => {
    return onMessageListener((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    });
    // `env.FIREBASE_VAPID_SERVER_KEY`は環境変数であり, 変化することはないためdepsから除外
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const setToken = async () => {
      const token = await requestToken(vapidServerKey);
      if (
        token == null ||
        accountEmail == null ||
        currentAccount?.messageToken === token
      ) {
        return;
      }

      submitSubscribe({
        accountEmail: accountEmail,
        messageToken: token,
      });
    };
    setToken();
  }, [accountEmail, pathname]);

  useEffect(() => {
    if (notification?.title) {
      alert(`${notification.title}\n${notification.body}`);
    }
  }, [notification]);

  useEffect(() => {
    if (subscribeFetcher.data == null) {
      return;
    }

    setCurrentAccount(subscribeFetcher.data);
  }, [subscribeFetcher.data]);
};
