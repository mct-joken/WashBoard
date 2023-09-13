/// <reference lib="WebWorker" />

import { PrecacheHandler } from "@remix-pwa/sw";
import { Push } from "@remix-pwa/push";

export type {};
declare let self: ServiceWorkerGlobalScope;

const PAGES = "page-cache";
const DATA = "data-cache";
const ASSETS = "assets-cache";
const STATIC_ASSETS = ["/build/", "/icons/", "/favicon.ico"];

const precacheHandler = new PrecacheHandler({
  dataCacheName: DATA,
  documentCacheName: PAGES,
  assetCacheName: ASSETS,
});

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  event.waitUntil(precacheHandler.handle(event));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request.clone()));
});

/******** Push Event ********/
class PushHandler extends Push {
  async handlePush(event: PushEvent): Promise<void> {}

  async handleNotificationClick(event: NotificationEvent): Promise<void> {}

  async handleNotificationClose(event: NotificationEvent): Promise<void> {}

  async handleError(error: ErrorEvent): Promise<void> {}
}

const pushHandler = new PushHandler();

self.addEventListener("push", (event: PushEvent) => {
  pushHandler.handlePush(event);
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  pushHandler.handleNotificationClick(event);
});

self.addEventListener("notificationclose", (event: NotificationEvent) => {
  pushHandler.handleNotificationClose(event);
});

self.addEventListener("error", (error: ErrorEvent) => {
  pushHandler.handleError(error);
});
