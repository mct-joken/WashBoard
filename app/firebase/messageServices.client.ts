import type { MessagePayload, Unsubscribe } from "firebase/messaging";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const requestToken = async (vapidServerKey: string) => {
  const messaging = getMessaging();
  try {
    return await getToken(messaging, { vapidKey: vapidServerKey });
  } catch (err) {
    console.log("An error occurred while retrieving token.", err);
    return null;
  }
};

export const onMessageListener = (
  onListen: (payload: MessagePayload) => void
): Unsubscribe => {
  const messaging = getMessaging();
  return onMessage(messaging, onListen);
};
