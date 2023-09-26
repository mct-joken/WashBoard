import React, { useEffect } from "react";
import Logo from "../../public/icons/Group_41.svg";
import { json } from "@remix-run/cloudflare";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Menu from "~/components/menu";
import { getClient } from "~/db/client.server";
import { useAuth } from "~/hooks/useAuth";
import {
  UsesAPI,
  UsesAPIResponse,
  action as getUsesAction,
} from "./resources.uses";
import { fetcherSubmitter } from "~/utils/fetcherSubmitter";
import { Header } from "~/components/header";

export const loader = async () => {
  const rooms = await getClient().query.rooms.findMany({
    with: { laundries: true },
  });
  return json({ rooms });
};

export default function Home() {
  const { ready, user } = useAuth();
  const usesFetcher = useFetcher<typeof getUsesAction>();
  const submitUses = fetcherSubmitter<UsesAPI>(
    usesFetcher,
    "/resources/uses",
    "POST"
  );

  const [uses, setUses] = useState<UsesAPIResponse["uses"]>();
  useEffect(() => {
    if (usesFetcher.data?.uses == null) {
      return;
    }
    setUses(usesFetcher.data.uses);
  }, [usesFetcher.data]);
  useEffect(() => {
    if (user?.email == null) {
      return;
    }
    submitUses({
      accountEmail: user.email,
    });
  }, [user]);
  //loaderから部屋の情報を取得
  const { rooms } = useLoaderData<typeof loader>();
  //セレクトボックスの値を取得している
  const [filter, setFilter] = useState("all");
  const dataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };
  return (
    <main>
      <Header title={"利用状況"}></Header>
      <div className=" flex flex-row justify-center my-3">
        <div className="w-20 mx-3">
          {/*ソート用のセレクトボックス*/}

          <select name="sort" id="sort" onChange={dataChange}>
            <option defaultValue="all" value="all">
              すべて
            </option>
            <option value="empty">空きあり</option>
            {/* <option value="favorite">お気に入り</option> */}
          </select>
        </div>
      </div>
      <p className="border rounded mx-10"></p>
      <div className=" max-h-72 mx-5 px-5 my-5  overflow-y-auto">
        {
          /*部屋情報の表示roomsからすべての部屋のデータを取ってきてるのでmapで表示*/
          rooms.map((room) => {
            //配下の洗濯機が動いているかの確認.1台でも空いていたらtrueになる
            const runningLaundriesCount =
              room.laundries.length -
              room.laundries.filter((r) => r.running).length;
            const isRoomAvailable = runningLaundriesCount != 0;
            if (isRoomAvailable) {
              return (
                <div className="flex flex-row justify-center my-2.5 ">
                  <div className=" rounded-full bg-blue-400  py-1 px-5 text-white mr-3">
                    空
                  </div>

                  <p className=" text-20 mr-2 text-lg">{room.place}</p>
                  <p className=" text-20 mr-2 text-lg">
                    {runningLaundriesCount}台使用可
                  </p>
                </div>
              );
            } else if (filter == "all") {
              return (
                <div className="flex flex-row justify-center my-2.5 ">
                  <div className=" rounded-full bg-red-400   py-1 px-5 text-white mr-3 ">
                    満
                  </div>
                  <p className=" text-20 mr-2 text-lg">{room.place}</p>
                  <p className=" text-20 mr-2 text-lg">
                    {runningLaundriesCount}台使用可
                  </p>
                </div>
              );
            }
          })
        }
      </div>
      <p className="border rounded mx-10"></p>
      <p className="text-center mb-5">あなたの利用状況</p>
      {/*もし使用中だと */}
      {uses?.length && uses.length > 0 ? (
        <div className="max-h-72 mx-5 px-5 my-5  overflow-y-auto">
          <div className="flex flex-row justify-center my-2.5">
            {uses.map((use) => (
              <div key={use.id} className="flex flex-row">
                {use.laundry?.running ? (
                  <p className="mr-2.5 text-lg">洗濯中</p>
                ) : (
                  <p className="mr-2.5 text-lg">終了</p>
                )}
                <p className=" mr-2 text-lg">{use.laundry?.room?.place}</p>

                {!use.laundry?.running &&  use.laundry ?(
                  <Link
                    to={`/wash/complete/${use.laundry.id}`}
                    className=" rounded-full bg-green-400 
                 hover:bg-green-700 py-1 px-5 text-white mr-3"
                  >
                    回収
                  </Link>
                ):("")}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center mb-5">なし</p>
      )}

      <Menu />
    </main>
  );
}
