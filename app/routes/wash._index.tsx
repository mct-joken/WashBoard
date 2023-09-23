import { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { Header } from "~/components/header";
import Menu from "~/components/menu";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { Laundry, Room } from "~/db/schema";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { action as startWashAction } from "~/routes/wash.start.$laundryId";

const Wash = () => {
  const actionData = useActionData<typeof startWashAction>();
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

    fetch(`/resources/laundry/checkAvailable/${qrResult}`, { method: "POST" })
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
          action={`/wash/start/${targetLaundry.id}`}
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
