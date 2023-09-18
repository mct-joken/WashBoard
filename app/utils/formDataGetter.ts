export const formDataGetter =
  <API>(formData: FormData) =>
  (key: Extract<keyof API, string>) =>
    formData.get(key);
