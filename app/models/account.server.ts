import { eq } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import { Account, NewAccount, accounts } from "~/db/schema";

/**
 * `accounts`テーブルから全ての`Account`を取得する
 * @returns 取得した`Account`の配列
 */
export async function getAccounts(): Promise<Account[]> {
  return getClient().select().from(accounts).all();
}

/**
 * `accounts`テーブルから`id`が合致する`Account`を取得する
 * @param id 検索するid
 * @returns `id`が合致する`Account`が存在した場合はその`Account`, 存在しなければ`undefined`
 */
export async function getAccountById(
  id: Account["id"]
): Promise<Account | undefined> {
  return getClient().select().from(accounts).where(eq(accounts.id, id)).get();
}

/**
 * `accounts`テーブルから`email`が合致する`Account`を取得する
 * @param email 検索するメールアドレス
 * @returns `email`が合致する`Account`が存在した場合はその`Account`, 存在しなければ`undefined`
 */
export async function getAccountByEmail(
  email: Account["email"]
): Promise<Account | undefined> {
  return getClient()
    .select()
    .from(accounts)
    .where(eq(accounts.email, email))
    .get();
}

/**
 * 新しい`Account`を作成して`accounts`テーブルに挿入する
 * @param email 新しい`Account`のメールアドレス
 * @param role 新しい`Account`のロール
 * @returns 挿入された`Account`
 */
export async function createAccount(
  email: Account["email"],
  role: Account["role"] = null
): Promise<Account> {
  const newAccount: NewAccount = { email, role };

  return getClient().insert(accounts).values(newAccount).returning().get();
}

/**
 * `accounts`テーブルの`id`が合致する`Account`を更新する
 * @param account 更新する`Account`
 * @returns 更新された`Account`
 */
export async function updateAccount(account: {
  id: Account["id"];
  email?: Account["email"];
  role?: Account["role"];
  messageToken?: Account["messageToken"];
}): Promise<Account | undefined> {
  const { id, email, role, messageToken } = account;
  return getClient()
    .update(accounts)
    .set({ email, role, messageToken, updatedAt: new Date() })
    .where(eq(accounts.id, id))
    .returning()
    .get();
}

/**
 * `accounts`テーブルから`id`が合致する`Account`を削除する
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`Account`, 削除できなければ`undefined`
 */
export async function deleteAccountById(
  id: Account["id"]
): Promise<Account | undefined> {
  return getClient()
    .delete(accounts)
    .where(eq(accounts.id, id))
    .returning()
    .get();
}

/**
 * `accounts`テーブルから`email`が合致する`Account`を削除する
 * @param email 検索するメールアドレス
 * @returns 削除できた場合はその削除された`Account`, 削除できなければ`undefined`
 */
export async function deleteAccountByEmail(
  email: Account["email"]
): Promise<Account | undefined> {
  return getClient()
    .delete(accounts)
    .where(eq(accounts.email, email))
    .returning()
    .get();
}
