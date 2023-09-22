import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getLaundryById, updateLaundry } from "~/models/laundry.server";

type LaundryStatusAPI = {
  status: string;
};

type LaundryStatus = {
  running: boolean;
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  // `PUT`以外を許可しない
  if (request.method !== "PUT") {
    return new Response(null, { status: 405 });
  }

  const laundryId = params.id;

  if (laundryId == null) {
    return new Response(null, { status: 400 });
  }

  if ((await getLaundryById(laundryId)) == null) {
    return new Response(null, { status: 404 });
  }

  const body = await request.json<LaundryStatusAPI>().catch(() => null);
  if (body == null || (body.status !== "true" && body.status !== "false")) {
    return new Response(null, { status: 400 });
  }

  const laundryStatus: LaundryStatus = { running: body.status === "true" };

  const result = await updateLaundry({
    id: laundryId,
    running: laundryStatus.running,
  });
  if (result == null) {
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
};
