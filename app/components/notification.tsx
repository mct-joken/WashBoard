import { MessagePayload } from "firebase/messaging";
import { useEffect, useState } from "react";
import { onMessageListener, requestToken } from "~/libs/firebase";

const Notification = (props: { env: Env }) => {
  const { env } = props;
  const [notification, setNotification] = useState<{
    title: string | undefined;
    body: string | undefined;
  }>();

  useEffect(() => {
    (async () => {
      await requestToken(env.FIREBASE_VAPID_SERVER_KEY);
      onMessageListener()
        .then((_payload) => {
          const payload = _payload as MessagePayload;
          setNotification({
            title: payload?.notification?.title,
            body: payload?.notification?.body,
          });
        })
        .catch((err) => console.log(`failed: ${err}`));
    })();
  }, []);

  useEffect(() => {
    if (notification?.title) {
      alert(`title: ${notification.title}\nbody: ${notification.body}`);
    }
  }, [notification]);

  return <></>;
};

export default Notification;
