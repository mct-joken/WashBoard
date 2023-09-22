import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { getClient } from "~/db/client.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = () => null;

export type LaundryCheckAvailableAPI = {
  laundryId: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const get = formDataGetter<LaundryCheckAvailableAPI>(formData);

  const laundryId = get("laundryId");
  if (!isString(laundryId)) {
    return json({}, 400);
  }

  const laundry = await getClient().query.laundries.findFirst({
    where: (laundry, { eq }) => eq(laundry.id, laundryId),
    with: { use: true, room: true },
  });

  if (laundry == null) {
    return json({}, 404);
  }

  if (laundry.use != null) {
    return json({}, 200);
  }

  return json({ laundry }, 200);
};
