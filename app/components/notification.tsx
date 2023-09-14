import { useEffect, useState } from "react";
import { onMessageListener, requestToken } from "~/firebase/messageServices.client";

const Notification = (props: { env: Env }) => {
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
  }, []);

  useEffect(() => {
    if (notification?.title) {
      alert(`title: ${notification.title}\nbody: ${notification.body}`);
    }
  }, [notification]);

  return <></>;
};

export default Notification;
