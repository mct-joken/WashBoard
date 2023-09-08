import Logo from "../../public/images/logo.png";
import styles from "../tailwind.css";
import { json, LinksFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

import { useState, useMemo } from "react";
import Menu from "./menu";

//この辺でデータとか取ってきて自分の使用状況たしかめる
const ngmsg = "なし";
let okmsg = "使用中";

const msg = () => {
  if (true) {
    return (
      <div>
        <p className="text-center mb-5">{okmsg}</p>
        <Link to="/wash">
          <div className="flex justify-center items-center">
            <p
              className="  w-20 text-center rounded-full bg-green-400 
                        active:bg-green-700  hover:bg-green-700 py-1 px-5 text-white mr-3"
            >
              回収
            </p>
          </div>
        </Link>{" "}
      </div>
    );
  } else {
    return <p className="text-center mb-5">{ngmsg}</p>;
  }
};

const datas = [
  {
    label: "4棟2階",
    num: 2,
    empty: 0,
  },
  {
    label: "4棟3階",
    num: 2,
    empty: 0,
  },
  {
    label: "5棟1階",
    num: 1,
    empty: 1,
  },
  {
    label: "5棟2階",
    num: 2,
    empty: 0,
  },
  {
    label: "5棟3階",
    num: 1,
    empty: 1,
  },
];


export function showdata(selectdata: string) {
  return datas.map((element) => {
    if (selectdata == "empty" && element.empty == 0) {
      return (
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>

          <div className=" text-20 mr-2 text-lg">
            <p>{element.label}</p>
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>{element.num}</p>
          </div>
        </div>
      );
    } else if (selectdata == "all") {
      if (element.empty == 1) {
        return (
          <div className="flex flex-row justify-center my-2.5 ">
            <div className=" rounded-full bg-red-400 active:bg-red-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
              満
            </div>

            <div className=" text-20 mr-2 text-lg">
              <p>{element.label}</p>
            </div>
            <div className=" text-20 mr-2 text-lg">
              <p>{element.num}</p>
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
              <p>{element.label}</p>
            </div>
            <div className=" text-20 mr-2 text-lg">
              <p>{element.num}</p>
            </div>
          </div>
        );
      }
    } else return <></>;
  });
}
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
    <div className=" mt-2 mx-3">
      <div className="flex flex-row">
        <img src={Logo} alt="ロゴ" className=" h-10 mx-center my-auto"></img>
        <p className=" text-2xl  mx-auto my-auto">利用状況</p>
      </div>
      <div className=" flex flex-row justify-center my-3">
        <div className="w-20 mx-3">
          <form>
            <input
              type="text"
              id="place_search"
              className="bg-gray-700 border border-gray-900 text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white 
                            dark:border-gray-900 dark:placeholder-gray-400 dark:text-brack dark:focus:ring-blue-500 
                            dark:focus:border-blue-500"
              placeholder="検索"
              required
            ></input>
            <div>
              <select name="sort" id="sort" onChange={dataChange}>
                <option value="all" selected>
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
        {showdata(data)}
      </div>
      <p className="border rounded mx-10"></p>
      <p className="text-center mb-5">あなたの利用状況</p>
      {msg()}
      <Menu />
    </div>
  );
}
