import React from "react";
import Logo from "../../public/icons/Group_41.svg";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Menu from "~/components/menu";
import { LoaderArgs } from "@remix-run/cloudflare";
import { getUseById } from "~/models/use.server";
import { getClient } from "~/db/client.server";
import { accounts, laundries, useHistories } from "~/db/schema";

//この辺でデータとか取ってきて自分の使用状況たしかめる
//contextはいずれ消えます
const id = "IMzzwO0CP60q7glLLMVGV";
export const loader = async ({ context }: LoaderArgs) => {
  const rooms = await getClient(context).query.rooms.findMany({
    with: { laundries: true },
  });
  //usingは仮
  const  using= await getClient(context).query.accounts.findFirst({
    where: (using,{eq})=>eq(accounts.id,"IMzzwO0CP60q7glLLMVGV"),
    with:{
      uses:true,
    },
  });
  return json({ rooms, using });
};

export function ShowSelectData(filter: string) {
  const { rooms } = useLoaderData<typeof loader>();
  //部屋情報の表示roomsからすべての部屋のデータを取ってきてるのでmapで表示
  return rooms.map((room) => {
    //配下の洗濯機が動いているかの確認.1台でも空いていたらtrueになる
    const runningLaundriesCount =room.laundries.length- room.laundries.filter((r) => r.running).length
    let empty = runningLaundriesCount!=0
    if (filter == "empty" && empty) {
      return (
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>

          <div className=" text-20 mr-2 text-lg">
            <p>{room.place}</p>
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>{runningLaundriesCount}台使用可</p>
          </div>
        </div>
      );
    } else if (filter== "all") {
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
              <p>{runningLaundriesCount}台使用可</p>
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
              <p>{runningLaundriesCount}台使用可</p>
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
  const { using } = useLoaderData<typeof loader>();
  console.log(using?.uses);
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
      {using?.uses == null ? (
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
