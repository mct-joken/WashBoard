import { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { Header } from "~/components/header";
import Menu from "~/components/menu";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { Laundry, Room } from "~/db/schema";
import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { formDataGetter } from "~/utils/formDataGetter";
import { isString } from "~/utils/type";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { getLaundryById } from "~/models/laundry.server";
import { getAccountByEmail } from "~/models/account.server";
import { createUse } from "~/models/use.server";
import { getClient } from "~/db/client.server";
import { desc } from "drizzle-orm";

export const action = async ({ request }: ActionFunctionArgs) => {
  type WashStartAPI = {
    laundryId: string;
    accountEmail: string;
    forgetting: string;
  };

  const formData = await request.formData();
  const get = formDataGetter<WashStartAPI>(formData);
  const laundryId = get("laundryId");
  const accountEmail = get("accountEmail");
  const forgetting = get("forgetting");

  console.log(JSON.stringify({ laundryId, accountEmail, forgetting }));
  if (
    !isString(laundryId) ||
    !isString(accountEmail) ||
    !(forgetting === "on" || forgetting === "off")
  ) {
    return json({ error: true }, 400);
  }

  const laundry = await getLaundryById(laundryId);
  const account = await getAccountByEmail(accountEmail);

  if (laundry == null || account == null) {
    return json({ error: true }, 404);
  }

  const use = await createUse(account.id, laundry.id);
  if (use == null) {
    return json({ error: true }, 500);
  }

  if (forgetting == "on") {
    const prevUse = await getClient().query.useHistories.findFirst({
      where: (useHistory, { eq }) => eq(useHistory.laundryId, laundryId),
      orderBy: (useHistory) => desc(useHistory.endAt),
      with: {
        account: true,
      },
    });
    if (prevUse == null || prevUse.account == null) {
      return json({ error: false }, 200);
    }

    await fetch("/resources/notification/send", {
      method: "POST",
      body: JSON.stringify({
        to: prevUse.account.messageToken,
        notificationTitle: "取り忘れのお知らせ",
        notificationBody: `${laundry.room?.place}の洗濯機で洗濯物を取り忘れているようです。`,
      }),
    });
  }

  return redirect("/home");
};

const Wash = () => {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [targetLaundry, setTargetLaundry] = useState<
    (Laundry & { room: Room }) | null
  >(null);

  const { ref } = useZxing({
    onDecodeResult: (result) => setQrResult(result.getText()),
  });

  useEffect(() => {
    if (qrResult == null) {
      return;
    }

    const form = new FormData();
    form.append("laundryId", qrResult);
    fetch("/resources/laundry/checkAvailable", {
      method: "POST",
      body: form,
    })
      .then(async (response) => {
        if (!response.ok) {
          alert("エラーが発生しました。もう一度読み取り直してください。");
          return;
        }

        const data = await response.json<{ laundry?: any }>();
        if (data.laundry == null) {
          alert("この洗濯機は現在使用されています。");
        }
        setTargetLaundry(data.laundry ?? null);
      })
      .catch(() => {
        alert("エラーが発生しました。もう一度読み取り直してください。");
      });
  }, [qrResult]);

  useEffect(() => {
    if (actionData?.error) {
      alert("エラーが発生しました。もう一度読み取り直してください。");
      navigate(0);
    }
  }, [actionData]);

  return (
    <div>
      <Header title={targetLaundry ? "洗濯開始" : "洗濯"} />
      {!targetLaundry && (
        <>
          <div className="h-60">
            <video ref={ref} className="container h-60 mx-auto" />
          </div>
          <p className="text-center">
            使用する洗濯機のQRコードを読み込んで下さい
          </p>
        </>
      )}

      {targetLaundry && (
        <Form
          method="post"
          className="
            mt-32
            flex flex-col gap-5 justify-center items-center
          "
        >
          <p>使用する洗濯機</p>
          <p className="text-2xl">{targetLaundry.room.place}</p>

          <div className="flex flex-row justify-center items-center">
            <input type="checkbox" name="forgetting" className="w-5 h-5 m-2" />
            <label>取り忘れを報告</label>
          </div>

          <input type="hidden" name="laundryId" value={targetLaundry.id} />
          <input
            type="hidden"
            name="accountEmail"
            value={"alice@example.com"}
          />

          <button
            type="submit"
            className="
              px-4 py-2
              rounded
              bg-green-400 hover:bg-green-300 text-white
              flex flex-row justify-center items-center
            "
          >
            <MdOutlineLocalLaundryService size={20} /> 開始
          </button>
        </Form>
      )}

      <Menu />
    </div>
  );
};

export default Wash;
