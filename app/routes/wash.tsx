import React, { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { Link } from "@remix-run/react";
import { Header } from "~/components/header";
import Menu from "~/components/menu";
import { start } from "repl";
import { Login } from "~/components/login";
import { useAuth } from "~/hooks/useAuth";
import {
  GrCheckboxSelected,
  GrCheckbox
} from "react-icons/gr";
import {
  MdHomeFilled,
  MdOutlineLocalLaundryService,
  MdOutlineSettings,
} from "react-icons/md";
const id = "ID";

const Wash = () => {

  // チェックボックスの状態を管理するための状態変数
  const [isChecked, setIsChecked] = useState(false);

  // チェックボックスの状態をトグルする関数
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };


  // QR読み込み用状態変数
  const [result, setResult] = useState('No result');
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
  });

  // QRを読み込んだら遷移
  const [start, setstart] = useState(false);
  useEffect(() => {
    if (result != 'No result') {
      setstart(true)
    }
  }, [result])

  const { ready, user } = useAuth();

  return (
    <div>

      {!start && (

        <div>
          <Header title="洗濯" />
          {/*QR読み込み*/}
          <div>
            <video ref={ref} className="container mt-10" />
            <p className="text-center">
              <span>Last result:</span>
              <span>{result}</span>
            </p>
          </div>

          {/*テキスト*/}
          <div className="text-center">
            <p>使用する洗濯機のQRコードを読み込んで下さい</p>
          </div>
        </div>
      )}

      {start && (
        <div>
          <Header title="洗濯開始" />
          <div className="text-center mt-36">
            <p>使用する洗濯機</p>
            <p className="text-2xl mt-4">{id}</p>
          </div>
          {/* チェックボックス */}
          <label className="flex items-center justify-center mt-20">
            <div onClick={toggleCheckbox}>
              {isChecked ? (
                <GrCheckbox size={20} />
              ) : null}
              {!isChecked ? (
                <GrCheckboxSelected size={20} />
              ) : null}
            </div>
            <div className="ml-2">取り忘れを報告</div>
          </label>
          {/*開始ボタン*/}
          <div className="flex  justify-center mt-14">
            <button
              type="button"
              className="bg-green-400 hover:bg-green-300 text-white rounded px-4 py-2"
            >
              <label className="flex items-center justify-center">
                <MdOutlineLocalLaundryService size={20} />
                開始
              </label>
            </button>
          </div>
        </div>
      )}
      <Menu />
    </div>
  );
};

export default Wash;