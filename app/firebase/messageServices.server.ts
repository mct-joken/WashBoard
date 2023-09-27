import { createAccessToken } from "./jwt.server";

type TargetToken = string;

export type Notification = {
  title: string;
  body: string;
  image?: string;
  link?: string;
};

type MessageConfig = {
  projectId: string;
  serviceAccount: GoogleApplicationCredentials;
};

export const pushMessage = async (
  to: TargetToken,
  notification: Notification,
  config: MessageConfig
) => {
  const accessToken = await createAccessToken(config.serviceAccount);
  const request = `https://fcm.googleapis.com/v1/projects/${config.projectId}/messages:send`;
  const message = {
    token: to,
    notification: {
      title: notification.title,
      body: notification.body,
      image: notification.image,
    },
    webpush: {
      fcm_options: {
        link: notification.link,
      },
    },
  };

  return await fetch(request, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ message }),
  });
};
