import Logo from "../../public/images/logo.png";
import styles from "../tailwind.css";
import { json, LinksFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

import { useState,useMemo } from "react";
import Select from "react-select";

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
            <p className="  w-20 text-center rounded-full bg-green-400 
                        active:bg-green-700  hover:bg-green-700 py-1 px-5 text-white mr-3">
              回収
            </p>
          </div>
        </Link>{" "}
        {""}
      </div>
    );
  } else {
    return <p className="text-center mb-5">{ngmsg}</p>;
  }
};
const datas = [
  {
    value: "042",
    label: "4棟2階",
    num: 2,
  },
  {
    value: "043",
    label: "4棟3階",
    num: 2,
  },
  {
    value: "051",
    label: "5棟1階",
    num: 1,
  },
  {
    value: "052",
    label: "5棟2階",
    num: 2,
  },
  {
    value: "053",
    label: "5棟3階",
    num: 1,
  },
];

export function showdata(free: number) {
  for (let i = 0; i < datas.length; i++) {
    if (free == 0) {
      if (datas[i]["num"] == 1) return "満";
      else return "空";
    } else if (free == 1) return datas[i]["label"];
  }
}

export default function home() {
  const [selectedValue, setSelectedValue] = useState(datas[0]);
  return (
    <div className=" mt-2 mx-3">
      <div className="flex flex-row">
        <img src={Logo} alt="ロゴ" className=" h-10 mx-center my-auto"></img>
        <p className=" text-2xl  mx-auto my-auto">利用状況</p>
      </div>
      <form>
        <div className=" flex flex-row-reverse my-3">
          <div></div>
          <div></div>
          <div className="w-20 mx-3">
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
              <Select
                options={datas}
                defaultValue={selectedValue}
                onChange={(value) => {
                  value ? setSelectedValue(value) : null;
                }}

              />
            </div>
          </div>
        </div>
      </form>
      <p className="border rounded mx-10"></p>
      <div className=" max-h-72 mx-5 px-5 my-5  overflow-y-auto">
        {/*DBからデータ取れるようになるまで仮のデータ*/}

        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-red-400 active:bg-red-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            {showdata(0)}
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>{showdata(1)}</p>
          </div>
          <div className=" text-20 text-lg">
            <p>1台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>5棟3階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>1台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-red-400 active:bg-red-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            満
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>4棟2階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>2台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>5棟3階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>1台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-red-400 active:bg-red-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            満
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>4棟2階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>2台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>5棟3階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>1台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-red-400 active:bg-red-400   py-1 px-5 text-white mr-3 p-0 w-30 ">
            満
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>4棟2階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>2台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>5棟3階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>1台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-red-400 active:bg-red-400   py-1 px-5 text-white mr-3 p-0 w-30 ">
            満
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>4棟2階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>2台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400   py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>5棟3階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>1台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-red-400 active:bg-red-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            満
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>4棟2階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>2台使用可</p>
          </div>
        </div>
        <div className="flex flex-row justify-center my-2.5 ">
          <div className=" rounded-full bg-blue-400 active:bg-blue-400  py-1 px-5 text-white mr-3 p-0 w-30 ">
            空
          </div>
          <div className=" text-20 mr-2 text-lg">
            <p>5棟3階</p>
          </div>
          <div className=" text-20 text-lg">
            <p>1台使用可</p>
          </div>
        </div>
      </div>
      <p className="border rounded mx-10"></p>
      <p className="text-center mb-5">あなたの利用状況</p>
      {msg()}
    </div>
  );
}
