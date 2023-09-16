import { useEffect, useState } from "react";
import {
  onMessageListener,
  requestToken,
} from "~/firebase/messageServices.client";

const NotificationHandler = (props: { env: Env }) => {
  const { env } = props;
  const [notification, setNotification] = useState<{
    title: string | undefined;
    body: string | undefined;
  }>();

  useEffect(() => {
    (async () => {
      await requestToken(env.FIREBASE_VAPID_SERVER_KEY);
    })();
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
    if (notification?.title) {
      alert(`title: ${notification.title}\nbody: ${notification.body}`);
    }
  }, [notification]);

  return <></>;
};

export default NotificationHandler;
