import { eq, getTableColumns } from "drizzle-orm";
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
import { makeAlias } from "~/utils/makeAlias";

const useHistoryWithAccountLaundryFields = {
  ...getTableColumns(useHistories),
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

type UseHistoryWithAccountLaundry = Omit<
  UseHistory & { account: Account | null } & { laundry: Laundry | null },
  "accountId" | "laundryId"
>;

/**
 * `useHistories`テーブルから全ての`UseHistory`を取得する
 * @returns 取得した`UseHistory`の配列
 */
export async function getUseHistories(): Promise<
  UseHistoryWithAccountLaundry[]
> {
  return getClient()
    .select(useHistoryWithAccountLaundryFields)
    .from(useHistories)
    .leftJoin(accounts, eq(useHistories.accountId, accounts.id))
    .leftJoin(laundries, eq(useHistories.laundryId, laundries.id))
    .all();
}

/**
 * `useHistories`テーブルから`id`が合致する`UseHistory`を取得する
 * @param id 検索するid
 * @returns `id`が合致する`UseHistory`が存在した場合はその`UseHistory`, 存在しなければ`undefined`
 */
export async function getUseHistoryById(
  id: UseHistory["id"]
): Promise<UseHistoryWithAccountLaundry | undefined> {
  return getClient()
    .select(useHistoryWithAccountLaundryFields)
    .from(useHistories)
    .leftJoin(accounts, eq(useHistories.accountId, accounts.id))
    .leftJoin(laundries, eq(useHistories.laundryId, laundries.id))
    .where(eq(useHistories.id, id))
    .get();
}

/**
 * `useHistories`テーブルから`accountId`が合致する`UseHistory`を取得する
 * @param accountId 検索する`Account`のid
 * @returns `accountId`が合致する`UseHistory`の配列
 */
export async function getUseHistoriesByAccountId(
  accountId: UseHistory["accountId"] & string
): Promise<UseHistoryWithAccountLaundry[]> {
  return getClient()
    .select(useHistoryWithAccountLaundryFields)
    .from(useHistories)
    .leftJoin(accounts, eq(useHistories.accountId, accounts.id))
    .leftJoin(laundries, eq(useHistories.laundryId, laundries.id))
    .where(eq(useHistories.accountId, accountId))
    .all();
}

/**
 * `useHistories`テーブルから`laundryId`が合致する`UseHistory`を取得する
 * @param laundryId 検索する`Laundry`のid
 * @returns `laundryId`が合致する`UseHistory`の配列
 */
export async function getUseHistoriesByLaundryId(
  laundryId: UseHistory["laundryId"] & string
): Promise<UseHistoryWithAccountLaundry[] | undefined> {
  return getClient()
    .select(useHistoryWithAccountLaundryFields)
    .from(useHistories)
    .leftJoin(accounts, eq(useHistories.accountId, accounts.id))
    .leftJoin(laundries, eq(useHistories.laundryId, laundries.id))
    .where(eq(useHistories.laundryId, laundryId))
    .all();
}

/**
 * 新しい`UseHistory`を作成して`useHistories`テーブルに挿入する
 * @param accountId 新しい`UseHistory`と紐づく`Account`の`id`
 * @param laundryId 新しい`UseHistory`と紐づく`Laundry`の`id`
 * @returns 挿入された`UseHistory`
 */
export async function createUseHistory(
  accountId: UseHistory["accountId"],
  laundryId: UseHistory["laundryId"],
  startAt: UseHistory["startAt"],
  endAt: UseHistory["endAt"]
): Promise<UseHistory | undefined> {
  const newUseHistory: NewUseHistory = {
    accountId,
    laundryId,
    startAt,
    endAt,
  };

  return getClient()
    .insert(useHistories)
    .values(newUseHistory)
    .returning()
    .get();
}

/**
 * `useHistories`テーブルから`id`が合致する`UseHistory`を削除する
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`UseHistory`, 削除できなければ`undefined`
 */
export async function deleteUseHistoryById(
  id: UseHistory["id"]
): Promise<UseHistory | undefined> {
  return getClient()
    .delete(useHistories)
    .where(eq(useHistories.id, id))
    .returning()
    .get();
}

/**
 * `useHistories`テーブルから`accountId`が合致する`UseHistory`を削除する
 * @param accountId 検索する`Account`のid
 * @returns 削除された`UseHistory`の配列
 */
export async function deleteUseHistoriesByAccountId(
  accountId: UseHistory["accountId"] & string
): Promise<UseHistory[]> {
  return getClient()
    .delete(useHistories)
    .where(eq(useHistories.accountId, accountId))
    .returning()
    .all();
}

/**
 * `useHistories`テーブルから`laundryId`が合致する`UseHistory`を削除する
 * @param laundryId 検索する`Laundry`のid
 * @returns 削除された`UseHistory`の配列
 */
export async function deleteUseHistoriesByLaundryId(
  laundryId: UseHistory["laundryId"] & string
): Promise<UseHistory[]> {
  return getClient()
    .delete(useHistories)
    .where(eq(useHistories.laundryId, laundryId))
    .returning()
    .all();
}
