import { AppLoadContext } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";

export const client = (database: D1Database) => drizzle(database);

/**
 * データベースの`client`を作成する
 * @param context `loader`関数で渡される`context`
 * @returns 作成した`client`
 */
export function getClient(context: AppLoadContext) {
  const env = context.env as Env;
  return client(env.DB);
}
