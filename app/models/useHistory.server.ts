import { AppLoadContext } from "@remix-run/cloudflare";
import cuid from "cuid";
import { eq } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import {
  Account,
  Laundry,
  NewUseHistory,
  UseHistory,
  accounts,
  laundries,
  useHistories,
} from "~/db/schema";

const useHistoryWithAccountLaundryFields = {
  ...useHistories._.columns,
  account: accounts._.columns,
  laundry: laundries._.columns,
};

type UseHistoryWithAccountLaundry = Omit<
  UseHistory & { account: Account | null } & { laundry: Laundry | null },
  "accountId" | "laundryId"
>;

/**
 * `useHistories`テーブルから全ての`UseHistory`を取得する
 * @param context `loader`関数で渡される`context`
 * @returns 取得した`UseHistory`の配列
 */
export async function getUseHistories(
  context: AppLoadContext
): Promise<UseHistoryWithAccountLaundry[]> {
  return getClient(context)
    .select(useHistoryWithAccountLaundryFields)
    .from(useHistories)
    .leftJoin(accounts, eq(useHistories.accountId, accounts.id))
    .leftJoin(laundries, eq(useHistories.laundryId, laundries.id))
    .all();
}

/**
 * `useHistories`テーブルから`id`が合致する`UseHistory`を取得する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns `id`が合致する`UseHistory`が存在した場合はその`UseHistory`, 存在しなければ`undefined`
 */
export async function getUseHistoryById(
  context: AppLoadContext,
  id: UseHistory["id"]
): Promise<UseHistoryWithAccountLaundry | undefined> {
  return getClient(context)
    .select(useHistoryWithAccountLaundryFields)
    .from(useHistories)
    .leftJoin(accounts, eq(useHistories.accountId, accounts.id))
    .leftJoin(laundries, eq(useHistories.laundryId, laundries.id))
    .where(eq(useHistories.id, id))
    .get();
}

/**
 * `useHistories`テーブルから`accountId`が合致する`UseHistory`を取得する
 * @param context `loader`関数で渡される`context`
 * @param accountId 検索する`Account`のid
 * @returns `accountId`が合致する`UseHistory`の配列
 */
export async function getUseHistoriesByAccountId(
  context: AppLoadContext,
  accountId: UseHistory["accountId"] & string
): Promise<UseHistoryWithAccountLaundry[]> {
  return getClient(context)
    .select(useHistoryWithAccountLaundryFields)
    .from(useHistories)
    .leftJoin(accounts, eq(useHistories.accountId, accounts.id))
    .leftJoin(laundries, eq(useHistories.laundryId, laundries.id))
    .where(eq(useHistories.accountId, accountId))
    .all();
}

/**
 * `useHistories`テーブルから`laundryId`が合致する`UseHistory`を取得する
 * @param context `loader`関数で渡される`context`
 * @param laundryId 検索する`Laundry`のid
 * @returns `laundryId`が合致する`UseHistory`の配列
 */
export async function getUseHistoriesByLaundryId(
  context: AppLoadContext,
  laundryId: UseHistory["laundryId"] & string
): Promise<UseHistoryWithAccountLaundry[] | undefined> {
  return getClient(context)
    .select(useHistoryWithAccountLaundryFields)
    .from(useHistories)
    .leftJoin(accounts, eq(useHistories.accountId, accounts.id))
    .leftJoin(laundries, eq(useHistories.laundryId, laundries.id))
    .where(eq(useHistories.laundryId, laundryId))
    .all();
}

/**
 * 新しい`UseHistory`を作成して`useHistories`テーブルに挿入する
 * @param context `loader`関数で渡される`context`
 * @param accountId 新しい`UseHistory`と紐づく`Account`の`id`
 * @param laundryId 新しい`UseHistory`と紐づく`Laundry`の`id`
 * @returns 挿入された`UseHistory`
 */
export async function createUseHistory(
  context: AppLoadContext,
  accountId: UseHistory["accountId"],
  laundryId: UseHistory["laundryId"],
  startAt: UseHistory["startAt"],
  endAt: UseHistory["endAt"]
): Promise<UseHistory | undefined> {
  const newUseHistory: NewUseHistory = {
    id: cuid(),
    accountId,
    laundryId,
    startAt,
    endAt,
  };

  return getClient(context)
    .insert(useHistories)
    .values(newUseHistory)
    .returning()
    .get();
}

/**
 * `useHistories`テーブルから`id`が合致する`UseHistory`を削除する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`UseHistory`, 削除できなければ`undefined`
 */
export async function deleteUseHistoryById(
  context: AppLoadContext,
  id: UseHistory["id"]
): Promise<UseHistory | undefined> {
  return getClient(context)
    .delete(useHistories)
    .where(eq(useHistories.id, id))
    .returning()
    .get();
}

/**
 * `useHistories`テーブルから`accountId`が合致する`UseHistory`を削除する
 * @param context `loader`関数で渡される`context`
 * @param accountId 検索する`Account`のid
 * @returns 削除された`UseHistory`の配列
 */
export async function deleteUseHistoriesByAccountId(
  context: AppLoadContext,
  accountId: UseHistory["accountId"] & string
): Promise<UseHistory[]> {
  return getClient(context)
    .delete(useHistories)
    .where(eq(useHistories.accountId, accountId))
    .returning()
    .all();
}

/**
 * `useHistories`テーブルから`laundryId`が合致する`UseHistory`を削除する
 * @param context `loader`関数で渡される`context`
 * @param laundryId 検索する`Laundry`のid
 * @returns 削除された`UseHistory`の配列
 */
export async function deleteUseHistoriesByLaundryId(
  context: AppLoadContext,
  laundryId: UseHistory["laundryId"] & string
): Promise<UseHistory[]> {
  return getClient(context)
    .delete(useHistories)
    .where(eq(useHistories.laundryId, laundryId))
    .returning()
    .all();
}
