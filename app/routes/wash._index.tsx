import { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { Header } from "~/components/header";
import Menu from "~/components/menu";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import type { Laundry, Room } from "~/db/schema";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import type { action as startWashAction } from "~/routes/resources.wash.start.$laundryId";
import { useAuth } from "~/hooks/useAuth";
import { Spinner } from "~/components/spinner";
import { LaundryCheckAvailableAPIResponse } from "./resources.laundry.checkAvailable.$id";

const Wash = () => {
  const actionData = useActionData<typeof startWashAction>();
  const navigate = useNavigate();
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [targetLaundry, setTargetLaundry] = useState<
    (Laundry & { room: Room | null }) | null
  >(null);
  const { ready, user } = useAuth();

  const { ref } = useZxing({
    onDecodeResult: (result) => setQrResult(result.getText()),
  });

  useEffect(() => {
    if (qrResult == null) {
      return;
    }

    fetch(`/resources/laundry/checkAvailable/${qrResult}`, { method: "POST" })
      .then(async (response) => {
        const data = await response.json<LaundryCheckAvailableAPIResponse>();
        if (!response.ok || data.laundry == null) {
          alert(
            data.error ??
              "エラーが発生しました。もう一度読み取り直してください。"
          );
          navigate(0);
          return;
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
  }, [actionData, navigate]);

  return (
    <>
      <Header title={targetLaundry ? "洗濯開始" : "洗濯"} />
      {targetLaundry == null ? (
        <div className="flex flex-col justify-center items-center">
          <div id="video-qr-container" className="container">
            <video ref={ref} className="container" id="video-qr" />
          </div>
          {!ready ? (
            <Spinner />
          ) : (
            <p className="text-center">
              使用する洗濯機のQRコードを読み込んで下さい
            </p>
          )}
        </div>
      ) : (
        <Form
          action={`/resources/wash/start/${targetLaundry.id}`}
          method="post"
          className="
            mt-32
            flex flex-col gap-5 justify-center items-center
          "
        >
          <p>使用する洗濯機</p>
          <p className="text-2xl">{targetLaundry.room?.place}</p>

          <div className="flex flex-row justify-center items-center">
            <input type="checkbox" name="forgetting" className="w-5 h-5 m-2" />
            <label>取り忘れを報告</label>
          </div>

          <input type="hidden" name="accountEmail" value={user?.email ?? ""} />

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
    </>
  );
};

export default Wash;
