import React from "react";
import Logo from "../../public/icons/Group_41.svg";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Menu from "~/components/menu";
import { LoaderArgs } from "@remix-run/cloudflare";
import { getLaundries } from "~/models/laundry.server";
import { getRooms } from "~/models/room.server";
import { getUseById } from "~/models/use.server";

//この辺でデータとか取ってきて自分の使用状況たしかめる
const id = "IMzzwO0CP60q7glLLMVGV";
export const loader = async ({ context }: LoaderArgs) => {
  const rooms = await getRooms(context);
  const laundries = await getLaundries(context);
  const now_use = await getUseById(context, id);
  return json({ rooms, laundries, now_use });
};

export function ShowSelectData(selectdata: string) {
  const { rooms } = useLoaderData<typeof loader>();
  const { laundries } = useLoaderData<typeof loader>();
  let Unused: { [key: string]: number } = {};

  return rooms.map((room) => {
    let empty = true;
    for (let i = 0; i < laundries.length; i++) {
      const laundrie = laundries[i];
      if (!Unused[room.place]) {
        Unused[room.place] = 0;
      }
      if (!laundrie.running) {
        Unused[room.place] += 1;
      }
      if (String(laundrie.room) !== room.place) {
        break;
      }
    }
    if (selectdata == "empty" && empty) {
      return (
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>

          <div className=" text-20 mr-2 text-lg">
            <p>{room.place}</p>
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>{Unused[room.place]}</p>
          </div>
        </div>
      );
    } else if (selectdata == "all") {
      if (empty) {
        return (
          <div className="flex flex-row justify-center my-2.5 ">
            <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
              空
            </div>

            <div className=" text-20 mr-2 text-lg">
              <p>{room.place}</p>
            </div>
            <div className=" text-20 mr-2 text-lg">
              <p>{Unused[room.place]}</p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-row justify-center my-2.5 ">
            <div className=" rounded-full bg-red-400 active:bg-red-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
              満
            </div>
            <div className=" text-20 mr-2 text-lg">
              <p>{room.place}</p>
            </div>
            <div className=" text-20 mr-2 text-lg">
              <p>{Unused[room.place]}</p>
            </div>
          </div>
        );
      }
    } else return <></>;
  });
}

export default function Home() {
  let [filter, SetFilter] = useState("all");
  const dataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    SetFilter(e.target.value);
  };
  const { now_use } = useLoaderData<typeof loader>();
  console.log(now_use)
  return (
    <main className=" mt-2 mx-3">
      <div className="flex flex-row">
        <img src={Logo} alt="ロゴ" className=" h-10 mx-center my-auto"></img>
        <p className=" text-2xl  mx-auto my-auto">利用状況</p>
      </div>
      <div className=" flex flex-row justify-center my-3">
        <div className="w-20 mx-3">
          <form>
            <div>
              <select name="sort" id="sort" onChange={dataChange}>
                <option defaultValue="all" value="all">
                  すべて
                </option>
                <option value="empty">空きあり</option>
                <option value="favorite">お気に入り</option>
              </select>
            </div>
          </form>
        </div>
      </div>
      <p className="border rounded mx-10"></p>
      <div className=" max-h-72 mx-5 px-5 my-5  overflow-y-auto">
        {ShowSelectData(filter)}
      </div>
      <p className="border rounded mx-10"></p>
      <p className="text-center mb-5">あなたの利用状況</p>
      {now_use != null ? (
        <div>
          <p className="text-center mb-5">使用中</p>
          <p className="text-center"></p>
          <Link to="/wash">
            <div className="flex justify-center items-center">
              <p
                className="  w-20 text-center rounded-full bg-green-400 
                    active:bg-green-700  hover:bg-green-700 py-1 px-5 text-white mr-3"
              >
                回収
              </p>
            </div>
          </Link>
        </div>
      ) : (
        <p className="text-center mb-5">なし</p>
      )}

      <Menu />
    </main>
  );
}
