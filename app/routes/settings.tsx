import React, { useState, useEffect } from "react";
import { Header } from "~/components/header";
import account from "public/account_box_FILL0_wght400_GRAD0_opsz48.png";
import notify from "public/edit_notifications_FILL0_wght400_GRAD0_opsz48.png";
import Menu from "~/components/menu";
import { useAuth } from "~/hooks/useAuth";
import { signOutFirebase } from "~/firebase/authServices.client";
import { Form } from "@remix-run/react";
import { isSupported } from "firebase/messaging";

export default function Setting() {
  const { user } = useAuth();
  const [notification, setNotification] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [reminderInterval, setReminderInterval] = useState<string>("");

  // Remixだと本来のやり方だとlocalStorageが使えないので、useEffectを使っています。詳しくは以下を参照してください。
  // https://remix.run/docs/en/1.19.3/guides/constraints#rendering-with-browser-only-apis
  useEffect(() => {
    const n = window.localStorage.getItem("notification");
    if (n === "true") {
      setNotification(true);
      const r = window.localStorage.getItem("reminder");
      if (r === "true") setReminder(true);
      else setReminder(false);
    } else {
      setNotification(false);
      setReminder(false);
    }
    const i = window.localStorage.getItem("reminderInterval");
    if (i) setReminderInterval(i);
    else setReminderInterval("3");
  }, []);
  const handleNotificationChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setNotification(checked);
    if (!checked) handleReminderChange(e);

    const isNotificationSupported = await isSupported();

    if (!isNotificationSupported) {
      alert("このブラウザは通知には対応していないようです。");
      setNotification(false);
      return;
    }

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    if (Notification.permission !== "granted") {
      alert("権限がないため、通知機能を使用することができません。");
      setNotification(false);
      return;
    }

    window.localStorage.setItem("notification", checked.toString());
  };
  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminder(e.target.checked);
    window.localStorage.setItem("reminder", e.target.checked.toString());
  };
  const handleReminderIntervalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
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
            {user && (
              <>
                <p className="my-2">{user.email}</p>
                <Form
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (
                      confirm(
                        "再度サインインするまでアプリを使用できなくなります。\nサインアウトしますか？"
                      )
                    ) {
                      signOutFirebase();
                    }
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-500 hover:underline"
                  >
                    サインアウト
                  </button>
                </Form>
              </>
            )}
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
                  <div className="w-10 h-6 rounded-full shadow-inner bg-gray-400 peer-checked:bg-sky-400"></div>
                  <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto bg-sky-50"></div>
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
                  <div className="w-10 h-6 rounded-full shadow-inner bg-gray-400 peer-checked:bg-sky-400"></div>
                  <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto bg-sky-50"></div>
                </span>
              </label>
            </div>
            {/* リマインダーがオンの時のみ表示 */}
            <div className="my-6 flex justify-between items-center">
              <p>リマインダーの間隔</p>
              <select
                className="w-25 h-7 text-base bg-white border border-gray-300 rounded-md"
                onChange={handleReminderIntervalChange}
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
      <Menu />
    </div>
  );
}
