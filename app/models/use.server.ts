import { eq, getTableColumns } from "drizzle-orm";
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
import { makeAlias } from "~/utils/makeAlias";

const useWithAccountLaundryFields = {
  ...getTableColumns(uses),
  account: {
    id: makeAlias(accounts.id),
    email: makeAlias(accounts.email),
    role: makeAlias(accounts.role),
    messageToken: makeAlias(accounts.messageToken),
    createdAt: makeAlias(accounts.createdAt),
    updatedAt: makeAlias(accounts.updatedAt),
  },
  laundry: {
    id: makeAlias(laundries.id),
    roomId: makeAlias(laundries.roomId),
    running: makeAlias(laundries.running),
    createdAt: makeAlias(laundries.createdAt),
    updatedAt: makeAlias(laundries.updatedAt),
  },
};

type UseWithAccountLaundry = Omit<
  Use & { account: Account | null } & { laundry: Laundry | null },
  "accountId" | "laundryId"
>;

/**
 * `uses`テーブルから全ての`Use`を取得する
 * @returns 取得した`Use`の配列
 */
export async function getUses(): Promise<UseWithAccountLaundry[]> {
  return getClient()
    .select(useWithAccountLaundryFields)
    .from(uses)
    .leftJoin(accounts, eq(uses.accountId, accounts.id))
    .leftJoin(laundries, eq(uses.laundryId, laundries.id))
    .all();
}

/**
 * `uses`テーブルから`id`が合致する`Use`を取得する
 * @param id 検索するid
 * @returns `id`が合致する`Use`が存在した場合はその`Use`, 存在しなければ`undefined`
 */
export async function getUseById(
  id: Use["id"]
): Promise<UseWithAccountLaundry | undefined> {
  return getClient()
    .select(useWithAccountLaundryFields)
    .from(uses)
    .leftJoin(accounts, eq(uses.accountId, accounts.id))
    .leftJoin(laundries, eq(uses.laundryId, laundries.id))
    .where(eq(uses.id, id))
    .get();
}

/**
 * `uses`テーブルから`accountId`が合致する`Use`を取得する
 * @param accountId 検索する`Account`のid
 * @returns `accountId`が合致する`Use`の配列
 */
export async function getUsesByAccountId(
  accountId: Use["accountId"] & string
): Promise<UseWithAccountLaundry[]> {
  return getClient()
    .select(useWithAccountLaundryFields)
    .from(uses)
    .leftJoin(accounts, eq(uses.accountId, accounts.id))
    .leftJoin(laundries, eq(uses.laundryId, laundries.id))
    .where(eq(uses.accountId, accountId))
    .all();
}

/**
 * `uses`テーブルから`laundryId`が合致する`Use`を取得する
 * @param laundryId 検索する`Laundry`のid
 * @returns `laundryId`が合致する`Use`が存在した場合はその`Use`, 存在しなければ`undefined`
 */
export async function getUseByLaundryId(
  laundryId: Use["laundryId"] & string
): Promise<UseWithAccountLaundry | undefined> {
  return getClient()
    .select(useWithAccountLaundryFields)
    .from(uses)
    .leftJoin(accounts, eq(uses.accountId, accounts.id))
    .leftJoin(laundries, eq(uses.laundryId, laundries.id))
    .where(eq(uses.laundryId, laundryId))
    .get();
}

/**
 * 新しい`Use`を作成して`uses`テーブルに挿入する
 * @param accountId 新しい`Use`と紐づく`Account`の`id`
 * @param laundryId 新しい`Use`と紐づく`Laundry`の`id`
 * @returns 挿入された`Use`
 */
export async function createUse(
  accountId: Use["accountId"],
  laundryId: Use["laundryId"]
): Promise<Use | undefined> {
  const newUse: NewUse = { accountId, laundryId };

  return getClient().insert(uses).values(newUse).returning().get();
}

/**
 * `uses`テーブルから`id`が合致する`Use`を削除する
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`Use`, 削除できなければ`undefined`
 */
export async function deleteUseById(id: Use["id"]): Promise<Use | undefined> {
  return getClient().delete(uses).where(eq(uses.id, id)).returning().get();
}

/**
 * `uses`テーブルから`accountId`が合致する`Use`を削除する
 * @param accountId 検索する`Account`のid
 * @returns 削除された`Use`の配列
 */
export async function deleteUseByAccountId(
  accountId: Use["accountId"] & string
): Promise<Use[]> {
  return getClient()
    .delete(uses)
    .where(eq(uses.accountId, accountId))
    .returning()
    .all();
}

/**
 * `uses`テーブルから`laundryId`が合致する`Use`を削除する
 * @param laundryId 検索する`Laundry`のid
 * @returns 削除できた場合はその削除された`Use`, 削除できなければ`undefined`
 */
export async function deleteUseByLaundryId(
  laundryId: Use["laundryId"] & string
): Promise<Use | undefined> {
  return getClient()
    .delete(uses)
    .where(eq(uses.laundryId, laundryId))
    .returning()
    .get();
}
