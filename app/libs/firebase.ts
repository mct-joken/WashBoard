import { getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

export const onMessageListener = () =>
  new Promise((resolve) => {
    const app = getApp();
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });
