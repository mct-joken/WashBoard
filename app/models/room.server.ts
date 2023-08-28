import { AppLoadContext } from "@remix-run/cloudflare";
import cuid from "cuid";
import { eq } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import { NewRoom, Room, rooms } from "~/db/schema";

/**
 * `rooms`テーブルから全ての`Room`を取得する
 * @param context `loader`関数で渡される`context`
 * @returns 取得した`Room`の配列
 */
export async function getRooms(context: AppLoadContext): Promise<Room[]> {
  return getClient(context).select().from(rooms).all();
}

/**
 * `rooms`テーブルから`id`が合致する`Room`を取得する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns `id`が合致する`Room`が存在した場合はその`Room`, 存在しなければ`undefined`
 */
export async function getRoomById(
  context: AppLoadContext,
  id: Room["id"]
): Promise<Room | undefined> {
  return getClient(context).select().from(rooms).where(eq(rooms.id, id)).get();
}

/**
 * `rooms`テーブルから`place`が合致する`Room`を取得する
 * @param context `loader`関数で渡される`context`
 * @param place 検索する場所名
 * @returns `place`が合致する`Room`が存在した場合はその`Room`, 存在しなければ`undefined`
 */
export async function getRoomByPlace(
  context: AppLoadContext,
  place: Room["place"]
): Promise<Room | undefined> {
  return getClient(context)
    .select()
    .from(rooms)
    .where(eq(rooms.place, place))
    .get();
}

/**
 * 新しい`Room`を作成して`rooms`テーブルに挿入する
 * @param context `loader`関数で渡される`context`
 * @param place 新しい`Room`の場所名
 * @returns 挿入された`Room`
 */
export async function createRoom(
  context: AppLoadContext,
  place: Room["place"]
): Promise<Room | undefined> {
  const newRoom: NewRoom = { id: cuid(), place };

  return getClient(context).insert(rooms).values(newRoom).returning().get();
}

/**
 * `rooms`テーブルから`id`が合致する`Room`を削除する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`Room`, 削除できなければ`undefined`
 */
export async function deleteRoomById(
  context: AppLoadContext,
  id: Room["id"]
): Promise<Room | undefined> {
  return getClient(context)
    .delete(rooms)
    .where(eq(rooms.id, id))
    .returning()
    .get();
}

/**
 * `rooms`テーブルから`place`が合致する`Room`を削除する
 * @param context `loader`関数で渡される`context`
 * @param place 検索する場所名
 * @returns 削除できた場合はその削除された`Room`, 削除できなければ`undefined`
 */
export async function deleteRoomByPlace(
  context: AppLoadContext,
  place: Room["place"]
): Promise<Room | undefined> {
  return getClient(context)
    .delete(rooms)
    .where(eq(rooms.place, place))
    .returning()
    .get();
}
