import React, { useState, useEffect } from "react";
import { Header } from "../components/header";
import account from "../../public/account_box_FILL0_wght400_GRAD0_opsz48.png";
import notify from "../../public/edit_notifications_FILL0_wght400_GRAD0_opsz48.png";

export default function Setting() {
  // メールアドレス表示は一時的にこうします。
  const email = "j2000@matsue-ct.ac.jp";

  const [notification, setNotification] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [reminderInterval, setReminderInterval] = useState<string>(""); // [min

  // Remixだと本来のやり方だとlocalStorageが使えないので、useEffectを使っています。詳しくは以下を参照してください。
  // https://remix.run/docs/en/1.19.3/guides/constraints#rendering-with-browser-only-apis
  useEffect(() => {
    const n = window.localStorage.getItem("notification");
    const boolN = Boolean(n);
    setNotification(boolN);

    const r = window.localStorage.getItem("reminder");
    const boolR = Boolean(r);
    setReminder(boolR);

    const i = window.localStorage.getItem("reminderInterval");
    if (i) setReminderInterval(i);
    else setReminderInterval("3");
  }, []);

  useEffect(() => {
    if (notification) window.localStorage.setItem("notification", "true");
    else {
      window.localStorage.removeItem("notification");
      setReminder(false);
      window.localStorage.removeItem("reminder");
    }
  }, [notification]);

  useEffect(() => {
    if (reminder) window.localStorage.setItem("reminder", "true");
    else window.localStorage.removeItem("reminder");
  }, [reminder]);

  useEffect(() => {
    window.localStorage.setItem("reminderInterval", reminderInterval);
  }, [reminderInterval]);

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotification(e.target.checked);
  };
  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminder(e.target.checked);
  };
  const handleReminderIntervalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setReminderInterval(value);
    window.localStorage.setItem("reminderInterval", value);
  };
  return (
    <div>
      <Header title="設定" />
      <main className="ml-8 mr-8">
        <section className="flex flex-col mb-5">
          <div className="flex items-center h-10 mt-2 mb-2">
            <img src={account} alt="icon" className="w-10 h-10 mr-2 left-0" />
            <h2 className="text-2xl">アカウント</h2>
          </div>
          <div className="ml-12">
            <p className="my-2">メールアドレス</p>
            <p className="my-2">{email}</p>
          </div>
        </section>
        <hr />
        <section className="flex flex-col">
          <div className="flex items-center h-10 mt-2 mb-2">
            <img src={notify} alt="icon" className="w-10 h-10 mr-2 left-0" />
            <h2 className="text-2xl">通知</h2>
          </div>
          <div className="ml-12">
            <div className="my-6 flex justify-between  items-center">
              <p>洗濯終了時に通知</p>
              <label className="inline-flex items-center space-x-4 ">
                <span className="relative">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    checked={notification}
                    onChange={handleNotificationChange}
                  />
                  <div className="w-10 h-6 rounded-full shadow-inner dark:bg-gray-400 peer-checked:dark:bg-sky-400"></div>
                  <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-sky-50"></div>
                </span>
              </label>
            </div>
            <div className="my-6 flex justify-between items-center">
              <p>洗濯終了時のリマインダー</p>
              <label className="inline-flex items-center space-x-4">
                <span className="relative">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    checked={reminder}
                    onChange={handleReminderChange}
                    disabled={!notification}
                  />
                  <div className="w-10 h-6 rounded-full shadow-inner dark:bg-gray-400 peer-checked:dark:bg-sky-400"></div>
                  <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-sky-50"></div>
                </span>
              </label>
            </div>
            {/* リマインダーがオンの時のみ表示 */}
            <div className="my-6 flex justify-between items-center">
              <p>リマインダーの間隔</p>
              <select
                className="w-25 h-7 text-base bg-white border border-gray-300 rounded-md"
                onChange={(e) => handleReminderIntervalChange(e)}
                value={reminderInterval}
                disabled={!reminder}
              >
                <option value="3" className="text-right">
                  3分
                </option>
                <option value="5" className="text-right">
                  5分
                </option>
                <option value="8" className="text-right">
                  8分
                </option>
                <option value="10" className="text-right">
                  10分
                </option>
                <option value="15" className="text-right">
                  15分
                </option>
                <option value="20" className="text-right">
                  20分
                </option>
                <option value="30" className="text-right">
                  30分
                </option>
                <option value="60" className="text-right">
                  1時間
                </option>
              </select>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
