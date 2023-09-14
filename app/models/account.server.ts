import { AppLoadContext } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import { Account, NewAccount, accounts } from "~/db/schema";

/**
 * `accounts`テーブルから全ての`Account`を取得する
 * @param context `loader`関数で渡される`context`
 * @returns 取得した`Account`の配列
 */
export async function getAccounts(context: AppLoadContext): Promise<Account[]> {
  return getClient(context).select().from(accounts).all();
}

/**
 * `accounts`テーブルから`id`が合致する`Account`を取得する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns `id`が合致する`Account`が存在した場合はその`Account`, 存在しなければ`undefined`
 */
export async function getAccountById(
  context: AppLoadContext,
  id: Account["id"]
): Promise<Account | undefined> {
  return getClient(context)
    .select()
    .from(accounts)
    .where(eq(accounts.id, id))
    .get();
}

/**
 * `accounts`テーブルから`email`が合致する`Account`を取得する
 * @param context `loader`関数で渡される`context`
 * @param email 検索するメールアドレス
 * @returns `email`が合致する`Account`が存在した場合はその`Account`, 存在しなければ`undefined`
 */
export async function getAccountByEmail(
  context: AppLoadContext,
  email: Account["email"]
): Promise<Account | undefined> {
  return getClient(context)
    .select()
    .from(accounts)
    .where(eq(accounts.email, email))
    .get();
}

/**
 * 新しい`Account`を作成して`accounts`テーブルに挿入する
 * @param context `loader`関数で渡される`context`
 * @param email 新しい`Account`のメールアドレス
 * @param role 新しい`Account`のロール
 * @returns 挿入された`Account`
 */
export async function createAccount(
  context: AppLoadContext,
  email: Account["email"],
  role: Account["role"] = null
): Promise<Account> {
  const newAccount: NewAccount = { email, role };

  return getClient(context)
    .insert(accounts)
    .values(newAccount)
    .returning()
    .get();
}

/**
 * `accounts`テーブルから`id`が合致する`Account`を削除する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`Account`, 削除できなければ`undefined`
 */
export async function deleteAccountById(
  context: AppLoadContext,
  id: Account["id"]
): Promise<Account | undefined> {
  return getClient(context)
    .delete(accounts)
    .where(eq(accounts.id, id))
    .returning()
    .get();
}

/**
 * `accounts`テーブルから`email`が合致する`Account`を削除する
 * @param context `loader`関数で渡される`context`
 * @param email 検索するメールアドレス
 * @returns 削除できた場合はその削除された`Account`, 削除できなければ`undefined`
 */
export async function deleteAccountByEmail(
  context: AppLoadContext,
  email: Account["email"]
): Promise<Account | undefined> {
  return getClient(context)
    .delete(accounts)
    .where(eq(accounts.email, email))
    .returning()
    .get();
}
