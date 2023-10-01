import type { ActionFunctionArgs, TypedResponse } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { getClient } from "~/db/client.server";
import type { Laundry, Room } from "~/db/schema";
import { isString } from "~/utils/type";

export const loader = () => null;

export type LaundryCheckAvailableAPI = {
  laundryId: string;
};

export type LaundryCheckAvailableAPIResponse = {
  laundry?: Laundry & { room: Room | null };
  error?: string;
};

export const action = async ({
  params,
}: ActionFunctionArgs): Promise<
  TypedResponse<LaundryCheckAvailableAPIResponse>
> => {
  const laundryId = params.id;
  if (!isString(laundryId)) {
    return json({ error: "laundryIdが指定されていません。" }, 400);
  }

  const laundry = await getClient().query.laundries.findFirst({
    where: (laundry, { eq }) => eq(laundry.id, laundryId),
    with: { use: true, room: true },
  });

  if (laundry == null) {
    return json({ error: "該当する洗濯機が見つかりません。" }, 404);
  }

  if (!laundry.running) {
    return json({ error: "洗濯機の電源が入っていません。" }, 423);
  }

  if (laundry.use != null && laundry.use.endAt == null) {
    return json({ error: "この洗濯機は現在使用されています。" }, 423);
  }

  return json({ laundry }, 200);
};
