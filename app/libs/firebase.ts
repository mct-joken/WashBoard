import { getApp } from "firebase/app";
import {
  MessagePayload,
  Unsubscribe,
  getMessaging,
  getToken,
  onMessage,
} from "firebase/messaging";

export const requestToken = async (vapidServerKey: string) => {
  const app = getApp();
  const messaging = getMessaging(app);
  try {
    const token = await getToken(messaging, { vapidKey: vapidServerKey });
    if (token) {
      console.log(`Current client token: ${token}`);
    } else {
      console.log(`No token available. Request permission to generate.`);
    }
  } catch (err) {
    console.log("An error occurred while retrieving token.", err);
  }
};

export const onMessageListener = (
  onListen: (payload: MessagePayload) => void,
): Unsubscribe => {
  const app = getApp();
  const messaging = getMessaging(app);
  return onMessage(messaging, onListen);
};
