import { createAccessToken } from "./jwt.server";

type TargetToken = string;

type Notification = {
  title: string;
  body: string;
  image?: string;
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
    notification,
  };

  return await fetch(request, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ message }),
  });
};
