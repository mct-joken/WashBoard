import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { Header } from "~/components/header";
import Menu from "~/components/menu";
import { getClient } from "~/db/client.server";
import { useHistories, uses } from "~/db/schema";
import { getLaundryById } from "~/models/laundry.server";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const laundryId = params.laundryId;

  if (!isString(laundryId)) {
    return redirect("/home");
  }

  const laundry = await getLaundryById(laundryId);
  if (laundry == null) {
    return redirect("/home");
  }

  return json({ laundry }, 200);
};

// TODO: Transactionを使っていないため安全ではない
// TODO: D1のTransactionもしくはDrizzleのD1 Batchサポートが為されたらそちらに戻す
export const action = async ({ request, params }: LoaderFunctionArgs) => {
  type WashCompleteAPI = {
    accountEmail: string;
  };

  const formData = await request.formData();
  const get = formDataGetter<WashCompleteAPI>(formData);
  const laundryId = params.laundryId;
  const accountEmail = get("accountEmail");

  if (!isString(laundryId) || !isString(accountEmail)) {
    return json({ error: true }, 400);
  }

  const use = await getClient().query.uses.findFirst({
    where: (use, { eq }) => eq(use.laundryId, laundryId),
    with: { account: true },
  });
  if (use == null) {
    return json({ error: true }, 404);
  }
  if (use.account?.email !== accountEmail) {
    return json({ error: true }, 403);
  }

  const deleted = await getClient().delete(uses).where(eq(uses.id, use.id));
  if (deleted.error != null) {
    return json({ error: true }, 500);
  }

  const useHistory = await getClient().insert(useHistories).values({
    accountId: use.accountId,
    laundryId: use.laundryId,
    startAt: use.createdAt,
    endAt: new Date(),
  });
  if (useHistory.error != null) {
    return json({ error: true }, 500);
  }

  return redirect("/home");
};

const Complete = () => {
  const navigate = useNavigate();
  const { laundry } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.error) {
      alert("エラーが発生しました。もう一度やり直してください。");
      navigate("/home");
    }
  }, [actionData, navigate]);

  return (
    <>
      <Header title="洗濯完了" />
      <Form
        method="post"
        className="
          mt-36
          flex flex-col justify-center items-center gap-20
          flex-grow
          text-center
        "
      >
        <div>
          <p>回収する洗濯機</p>
          <p className="text-2xl mt-4">{laundry.room?.place}</p>
        </div>

        <input type="hidden" name="accountEmail" value={"alice@example.com"} />

        <button
          type="submit"
          className="
              px-4 py-2
              rounded
              bg-green-400 hover:bg-green-300 text-white
              flex flex-row justify-center items-center
            "
        >
          <MdOutlineLocalLaundryService size={20} />
          完了
        </button>
      </Form>
      <Menu />
    </>
  );
};

export default Complete;
