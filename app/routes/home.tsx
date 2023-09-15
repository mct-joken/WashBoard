import React from "react";
import Logo from "../../public/images/logo.png";
import { json, LinksFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Menu from "~/components/menu";
import { LoaderArgs } from "@remix-run/cloudflare";
import { getLaundries } from "~/models/laundry.server";
import { laundries } from "~/db/schema";
import { getRooms } from "~/models/room.server";

//この辺でデータとか取ってきて自分の使用状況たしかめる
const ngmsg = "なし";
let okmsg = "使用中";


export const loader = async ({ context }: LoaderArgs) => {
  const rooms = await getRooms(context);
  const laundries = await getLaundries(context);
  return json({ rooms,laundries });
};

const is_use = () => {
  if (true) {
    return (
      <div>
        <p className="text-center mb-5">{okmsg}</p>
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
    );
  } else {
    return <p className="text-center mb-5">{ngmsg}</p>;
  }
};


export function show_select_data(selectdata: string,is_empty: boolean) {
  const { rooms } = useLoaderData<typeof loader>();
  const { laundries } = useLoaderData<typeof loader>();
  return rooms.map((element) => {
    if (selectdata == "empty" && is_empty) {
      return (
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>

          <div className=" text-20 mr-2 text-lg">
            <p>{element.place}</p>
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>{/*空いている数を表示*/}</p>
          </div>
        </div>
      );
    } else if (selectdata == "all") {
      if ({/*is_emptyがfalseなら*/}) {
        return (
          <div className="flex flex-row justify-center my-2.5 ">
            <div className=" rounded-full bg-red-400 active:bg-red-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
              満
            </div>

            <div className=" text-20 mr-2 text-lg">
              <p>{element.place}</p>
            </div>
            <div className=" text-20 mr-2 text-lg">
              <p>{/*空いている数を表示*/}</p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-row justify-center my-2.5 ">
            <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
              空
            </div>
            <div className=" text-20 mr-2 text-lg">
              <p>{element.place}</p>
            </div>
            <div className=" text-20 mr-2 text-lg">
              <p>{/*空いている数を表示*/}</p>
            </div>
          </div>
        );
      }
    } else return <></>;
  });
}
//セレクトボックスのデータをセット
export function setdata(value: string) {
  let selectdata = value;
  return selectdata;
}

export default function home() {
  let [data, setdata] = useState("all");
  const dataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setdata(e.target.value);
  };
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
                <option defaultValue="all" >
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
        {show_select_data(data)}
      </div>
      <p className="border rounded mx-10"></p>
      <p className="text-center mb-5">あなたの利用状況</p>
      {is_use()}
      
      <Menu />
    </main>
  );
}
