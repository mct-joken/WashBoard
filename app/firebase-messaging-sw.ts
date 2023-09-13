import { initializeApp } from "firebase/app";
import { MessagePayload } from "firebase/messaging";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBU8z5V0a0ENcje-qpAdCjTAJZOVVHkxxY",
  authDomain: "washboard-10795.firebaseapp.com",
  projectId: "washboard-10795",
  storageBucket: "washboard-10795.appspot.com",
  messagingSenderId: "73820488427",
  appId: "1:73820488427:web:75259076b8a68ed3eeb4ae",
});

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, async (payload: MessagePayload) => {
  console.log("Received background message", payload);
  const title = payload.notification?.title || "";
  const options: NotificationOptions = {
    body: payload.notification?.body + "wha!!!!!!!!!!!!" ?? "",
    silent: false,
  };

  const sw = this as unknown as ServiceWorkerGlobalScope;
  await sw.registration.showNotification(title, options);
});
