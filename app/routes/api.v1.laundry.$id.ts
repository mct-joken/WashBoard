import { ActionArgs } from "@remix-run/cloudflare";
import { getLaundryById, updateLaundry } from "~/models/laundry.server";

type LaundryStatusAPI = {
  status: string;
};

type LaundryStatus = {
  running: boolean;
};

export const action = async ({ params, request, context }: ActionArgs) => {
  // `PUT`以外を許可しない
  if (request.method !== "PUT") {
    return new Response(null, { status: 405 });
  }

  const laundryId = params.id;

  if (laundryId == null) {
    return new Response(null, { status: 400 });
  }

  if ((await getLaundryById(context, laundryId)) == null) {
    return new Response(null, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as LaundryStatusAPI;
  if (body == null || (body.status !== "true" && body.status !== "false")) {
    return new Response(null, { status: 400 });
  }

  const laundryStatus: LaundryStatus = { running: body.status === "true" };

  const result = await updateLaundry(context, {
    id: laundryId,
    running: laundryStatus.running,
  });
  if (result == null) {
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
};
