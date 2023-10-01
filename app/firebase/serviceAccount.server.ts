export const getServiceAccount = (env: Env) =>
  JSON.parse(
    env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  ) as GoogleApplicationCredentials;
