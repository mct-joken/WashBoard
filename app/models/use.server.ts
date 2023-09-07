import { AppLoadContext } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import {
  Account,
  Laundry,
  NewUse,
  Use,
  accounts,
  laundries,
  uses,
} from "~/db/schema";

const useWithAccountLaundryFields = {
  ...uses._.columns,
  account: accounts._.columns,
  laundry: laundries._.columns,
};

type UseWithAccountLaundry = Omit<
  Use & { account: Account | null } & { laundry: Laundry | null },
  "accountId" | "laundryId"
>;

/**
 * `uses`テーブルから全ての`Use`を取得する
 * @param context `loader`関数で渡される`context`
 * @returns 取得した`Use`の配列
 */
export async function getUses(
  context: AppLoadContext
): Promise<UseWithAccountLaundry[]> {
  return getClient(context)
    .select(useWithAccountLaundryFields)
    .from(uses)
    .leftJoin(accounts, eq(uses.accountId, accounts.id))
    .leftJoin(laundries, eq(uses.laundryId, laundries.id))
    .all();
}

/**
 * `uses`テーブルから`id`が合致する`Use`を取得する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns `id`が合致する`Use`が存在した場合はその`Use`, 存在しなければ`undefined`
 */
export async function getUseById(
  context: AppLoadContext,
  id: Use["id"]
): Promise<UseWithAccountLaundry | undefined> {
  return getClient(context)
    .select(useWithAccountLaundryFields)
    .from(uses)
    .leftJoin(accounts, eq(uses.accountId, accounts.id))
    .leftJoin(laundries, eq(uses.laundryId, laundries.id))
    .where(eq(uses.id, id))
    .get();
}

/**
 * `uses`テーブルから`accountId`が合致する`Use`を取得する
 * @param context `loader`関数で渡される`context`
 * @param accountId 検索する`Account`のid
 * @returns `accountId`が合致する`Use`の配列
 */
export async function getUsesByAccountId(
  context: AppLoadContext,
  accountId: Use["accountId"] & string
): Promise<UseWithAccountLaundry[]> {
  return getClient(context)
    .select(useWithAccountLaundryFields)
    .from(uses)
    .leftJoin(accounts, eq(uses.accountId, accounts.id))
    .leftJoin(laundries, eq(uses.laundryId, laundries.id))
    .where(eq(uses.accountId, accountId))
    .all();
}

/**
 * `uses`テーブルから`laundryId`が合致する`Use`を取得する
 * @param context `loader`関数で渡される`context`
 * @param laundryId 検索する`Laundry`のid
 * @returns `laundryId`が合致する`Use`が存在した場合はその`Use`, 存在しなければ`undefined`
 */
export async function getUseByLaundryId(
  context: AppLoadContext,
  laundryId: Use["laundryId"] & string
): Promise<UseWithAccountLaundry | undefined> {
  return getClient(context)
    .select(useWithAccountLaundryFields)
    .from(uses)
    .leftJoin(accounts, eq(uses.accountId, accounts.id))
    .leftJoin(laundries, eq(uses.laundryId, laundries.id))
    .where(eq(uses.laundryId, laundryId))
    .get();
}

/**
 * 新しい`Use`を作成して`uses`テーブルに挿入する
 * @param context `loader`関数で渡される`context`
 * @param accountId 新しい`Use`と紐づく`Account`の`id`
 * @param laundryId 新しい`Use`と紐づく`Laundry`の`id`
 * @returns 挿入された`Use`
 */
export async function createUse(
  context: AppLoadContext,
  accountId: Use["accountId"],
  laundryId: Use["laundryId"]
): Promise<Use | undefined> {
  const newUse: NewUse = { accountId, laundryId };

  return getClient(context).insert(uses).values(newUse).returning().get();
}

/**
 * `uses`テーブルから`id`が合致する`Use`を削除する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`Use`, 削除できなければ`undefined`
 */
export async function deleteUseById(
  context: AppLoadContext,
  id: Use["id"]
): Promise<Use | undefined> {
  return getClient(context)
    .delete(uses)
    .where(eq(uses.id, id))
    .returning()
    .get();
}

/**
 * `uses`テーブルから`accountId`が合致する`Use`を削除する
 * @param context `loader`関数で渡される`context`
 * @param accountId 検索する`Account`のid
 * @returns 削除された`Use`の配列
 */
export async function deleteUseByAccountId(
  context: AppLoadContext,
  accountId: Use["accountId"] & string
): Promise<Use[]> {
  return getClient(context)
    .delete(uses)
    .where(eq(uses.accountId, accountId))
    .returning()
    .all();
}

/**
 * `uses`テーブルから`laundryId`が合致する`Use`を削除する
 * @param context `loader`関数で渡される`context`
 * @param laundryId 検索する`Laundry`のid
 * @returns 削除できた場合はその削除された`Use`, 削除できなければ`undefined`
 */
export async function deleteUseByLaundryId(
  context: AppLoadContext,
  laundryId: Use["laundryId"] & string
): Promise<Use | undefined> {
  return getClient(context)
    .delete(uses)
    .where(eq(uses.laundryId, laundryId))
    .returning()
    .get();
}
