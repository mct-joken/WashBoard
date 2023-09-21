import jwt from "@tsndr/cloudflare-worker-jwt";

export const createAccessToken = async (
  serviceAccount: GoogleApplicationCredentials
) => {
  const iat = Math.floor(Date.now() / 1000); // [msec] to [sec]
  // 通知送信前に1回だけ生成して使い回さないことを想定しているので、有効期間は60[sec]
  const exp = iat + 60;

  const token = await jwt.sign(
    {
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: "https://fcm.googleapis.com/",
      iat,
      exp,
    },
    serviceAccount.private_key,
    {
      algorithm: "RS256",
      header: { typ: "JWT", kid: serviceAccount.private_key_id },
    }
  );

  return token;
};
