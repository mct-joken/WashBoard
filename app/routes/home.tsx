import { useEffect, useState } from "react";
import { json } from "@remix-run/cloudflare";
import {
  Link,
  useFetcher,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
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
import { Spinner } from "~/components/spinner";
import { useInterval } from "~/hooks/useInterval";

export const loader = async () => {
  const rooms = await getClient().query.rooms.findMany({
    with: { laundries: true },
  });
  return json({ rooms });
};

export default function Home() {
  const { ready, user } = useAuth();
  const { rooms } = useLoaderData<typeof loader>();
  type Filter = "all" | "empty";
  const [filter, setFilter] = useState<Filter>("all");
  const [uses, setUses] = useState<UsesAPIResponse["uses"] | null>(null);
  const usesFetcher = useFetcher<typeof getUsesAction>();
  const submitUses = fetcherSubmitter<UsesAPI>(
    usesFetcher,
    "/resources/uses",
    "POST"
  );
  const revalidator = useRevalidator();

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

  useEffect(() => {
    const onFocus = revalidator.revalidate;
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  });

  useInterval(revalidator.revalidate, 10_000);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <>
      <Header title={"利用状況"} />
      <div className="text-center my-3">
        <select
          name="sort"
          id="sort"
          onChange={(element) => setFilter(element.target.value as Filter)}
        >
          <option defaultValue="all" value="all">
            すべて
          </option>
          <option value="empty">空きあり</option>
        </select>
      </div>
      <p className="border rounded mx-10"></p>
      <div
        className="
          px-5 my-5 max-h-72
          flex flex-col justify-center items-center gap-2
          overflow-y-auto
        "
      >
        {rooms.map((room) => {
          const availableLaundriesCount = room.laundries.filter(
            (r) => !r.running
          ).length;
          if (availableLaundriesCount > 0) {
            return (
              <div className="flex flex-row justify-center gap-3" key={room.id}>
                <div
                  className="
                    py-1 px-5 rounded-3xl
                    bg-blue-400 text-white
                  "
                >
                  空
                </div>
                <p className="text-lg">{room.place}</p>
                <p className="text-lg">{availableLaundriesCount}台使用可</p>
              </div>
            );
          } else if (filter == "all") {
            return (
              <div className="flex flex-row justify-center gap-3" key={room.id}>
                <div
                  className="
                    py-1 px-5 rounded-3xl
                    bg-red-400 text-white
                  "
                >
                  満
                </div>
                <p className="text-lg">{room.place}</p>
                <p className="text-lg">{availableLaundriesCount}台使用可</p>
              </div>
            );
          }
        })}
      </div>
      <p className="border rounded mx-10"></p>
      <p className="text-center my-3">あなたの利用状況</p>
      {!ready || uses == null ? (
        <Spinner />
      ) : uses.length > 0 ? (
        <div
          className="
            py-3 max-h-52 overflow-y-auto
            flex flex-row justify-center gap-3
          "
        >
          {uses.map((use) => (
            <UseStatusCard use={use} key={use.id} />
          ))}
        </div>
      ) : (
        <p className="text-center mb-5">なし</p>
      )}
      <Menu />
    </>
  );
}

const UseStatusCard = (props: { use: UsesAPIResponse["uses"][number] }) => (
  <div className="flex flex-row gap-3">
    <p className="text-lg">{props.use.laundry?.room?.place}</p>
    {props.use.laundry?.running ? (
      <p
        className="
          px-5 py-1 rounded-3xl
          bg-blue-400 text-white
        "
      >
        洗濯中
      </p>
    ) : (
      <Link
        to={`/wash/complete/${props.use.laundry?.id}`}
        className="
          px-5 py-1 rounded-3xl shadow-md
          bg-green-400 hover:bg-green-500 text-white
        "
      >
        回収
      </Link>
    )}
  </div>
);
