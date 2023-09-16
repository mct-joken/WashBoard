import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import Menu from "~/components/menu";
import { requestToken } from "~/firebase/messageServices.client";
import { getAccountByEmail, updateAccount } from "~/models/account.server";

export const loader = async ({ context }: LoaderArgs) => {
  const env = context.env as Env;
  const account = await getAccountByEmail(context, "alice@example.com");
  if (account == null) {
    return redirect("/home");
  }

  return json({ context, env, account });
};

export const action = async ({ request, context }: ActionArgs) => {
  const formData = await request.formData();
  const accountId = formData.get("accountId");
  const messageToken = formData.get("messageToken");
  if (typeof accountId !== "string" || typeof messageToken !== "string") {
    return;
  }

  return await updateAccount(context, { id: accountId, messageToken });
};

const Subscribe = () => {
  const { env, account } = useLoaderData<typeof loader>();
  const [currentAccount, setCurrentAccount] = useState(account);
  const setMessageToken = useFetcher<typeof action>();

  const onSubscribe = async () => {
    const token = await requestToken(env.FIREBASE_VAPID_SERVER_KEY);
    if (currentAccount?.messageToken === token) {
      return;
    }

    setMessageToken.submit(
      {
        accountId: currentAccount.id,
        messageToken: token,
      },
      { method: "POST" }
    );
  };

  useEffect(() => {
    if (!setMessageToken.data) return;
    setCurrentAccount(setMessageToken.data);
  }, [setMessageToken.data]);

  return (
    <>
      <div className="p-3">
        <button
          onClick={onSubscribe}
          className="
            p-2 border rounded-lg
            shadow
            hover:bg-gray-300
            active:bg-slate-500 active:text-white active:shadow-none
          "
        >
          Subscribe notification
        </button>
      </div>
      <Menu />
    </>
  );
};

export default Subscribe;
