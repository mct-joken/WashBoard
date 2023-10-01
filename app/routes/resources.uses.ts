import type { ActionFunctionArgs, TypedResponse } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { getClient } from "~/db/client.server";
import { getAccountByEmail } from "~/models/account.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = () => null;

export type UsesAPI = {
  accountEmail: string;
};

export type UsesAPIResponse = {
  uses: {
    id: string;
    laundry?: {
      id?: string;
      running?: boolean | null;
      room?: {
        id?: string;
        place?: string;
      };
    };
  }[];
};

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<UsesAPIResponse>> => {
  const formData = await request.formData();
  const get = formDataGetter<UsesAPI>(formData);

  const accountEmail = get("accountEmail");

  if (!isString(accountEmail)) {
    return json({ uses: [] }, 400);
  }

  const account = await getAccountByEmail(accountEmail);
  if (account == null) {
    return json({ uses: [] }, 404);
  }
  const uses = await getClient().query.uses.findMany({
    where: (use, { eq }) => eq(use.accountId, account.id),
    with: {
      laundry: {
        with: {
          room: true,
        },
      },
    },
  });

  if (account == null) return json({ uses: [] }, 404);
  return json(
    {
      uses: uses.map((use) => ({
        id: use.id,
        laundry: {
          id: use.laundry?.id,
          running: use.laundry?.running,
          room: {
            id: use.laundry?.room?.id,
            place: use.laundry?.room?.place,
          },
        },
      })),
    },
    200
  );
};
