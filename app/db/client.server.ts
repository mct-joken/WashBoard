import type { AppLoadContext } from "@remix-run/cloudflare";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type Client = { db?: DrizzleD1Database<typeof schema> };
const _client: Client = { db: undefined };

export const client = (database: D1Database) =>
  drizzle(database, { schema, logger: true });

/**
 * データベースの`client`がまだ初期化されていなければ初期化する
 * @param context `loader`関数で渡される`context`
 * @returns 初期化済みもしくは作成された`client`
 */
export const initializeClient = (context: AppLoadContext) => {
  if (_client.db == null) {
    const env = context.env as Env;
    _client.db = client(env.DB);
  }

  return _client.db;
};

/**
 * データベースの初期化済み`client`を得る
 * @returns 初期化済みの`client`
 * @throws 初期化が行われていない場合、例外が発生する
 */
export const getClient = () => {
  if (_client.db == null) {
    throw new Error(
      "Client has not initialized yet. You should initialize to call `initializeClient` first."
    );
  }

  return _client.db;
};
