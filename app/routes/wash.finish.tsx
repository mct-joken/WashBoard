import React, { useState } from "react";
import { Link } from "@remix-run/react";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { Header } from "~/components/header";
import Menu from "~/components/menu";
const id = "ID";

const Finish = () => {
  // チェックボックスの状態を管理するための状態変数
  const [isChecked, setIsChecked] = useState(false);

  // チェックボックスの状態をトグルする関数
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <Header title="洗濯完了" />
      <div className="text-center mt-40">
        <p>回収する洗濯機</p>
        <p className="text-2xl mt-4">{id}</p>
      </div>

      <ul className="mt-16 space-y-16">
        <li>
          <br />
          {/*レイアウトをそろえるための空の要素*/}
        </li>
        <li>
          {/*開始ボタン*/}
          <div className="flex  justify-center mt-14">
            <button
              type="button"
              className="bg-green-400 hover:bg-green-300 text-white rounded px-4 py-2"
            >
              <label className="flex items-center justify-center">
                <MdOutlineLocalLaundryService size={20} />
                完了
              </label>
            </button>
          </div>
        </li>
      </ul>
      <Menu />
    </div>
  );
};

export default Finish;
