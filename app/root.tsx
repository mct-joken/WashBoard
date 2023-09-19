import { useSWEffect } from "@remix-pwa/sw";
import {
  json,
  type LinksFunction,
  type LoaderArgs,
} from "@remix-run/cloudflare";
import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useNotification } from "~/hooks/useNotification";
import stylesheet from "~/tailwind.css";
import { initializeClient } from "./db/client.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "manifest", href: "/resources.manifest.webmanifest" },
];

export const loader = ({ context }: LoaderArgs) => {
  const env = context.env as Env;

  initializeClient(context);

  const firebaseOptions: FirebaseOptions = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  };

  return json({
    vapidServerKey: env.FIREBASE_VAPID_SERVER_KEY,
    firebaseOptions,
  });
};

export default function App() {
  const { vapidServerKey, firebaseOptions } = useLoaderData<typeof loader>();

  useSWEffect();
  useNotification(vapidServerKey);
  initializeApp(firebaseOptions);

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
