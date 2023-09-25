export const form = (data: { [key in string]: string }): FormData => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => form.append(key, value));
  return form;
};
