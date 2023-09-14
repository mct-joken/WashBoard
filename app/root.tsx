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
import Notification from "app/components/notification";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "manifest", href: "/resources.manifest.webmanifest" },
];

export const loader = ({ context }: LoaderArgs) => {
  const env = context.env as Env;

  const firebaseOptions: FirebaseOptions = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  };

  return json({ env, firebaseOptions });
};

export default function App() {
  const { env, firebaseOptions } = useLoaderData<typeof loader>();

  useSWEffect();
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
        <Notification env={env as Env} />
      </body>
    </html>
  );
}
