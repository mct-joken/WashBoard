import { AppLoadContext } from "@remix-run/cloudflare";
import cuid from "cuid";
import { eq } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import { Laundry, NewLaundry, Room, laundries, rooms } from "~/db/schema";

const laundryWithRoomFields = {
  ...laundries._.columns,
  room: rooms._.columns,
};

type LaundryWithRoom = Omit<Laundry & { room: Room | null }, "roomId">;

/**
 * `laundries`テーブルから全ての`Laundry`を取得する
 * @param context `loader`関数で渡される`context`
 * @returns 取得した`Laundry`の配列
 */
export async function getLaundries(
  context: AppLoadContext
): Promise<LaundryWithRoom[]> {
  return getClient(context)
    .select(laundryWithRoomFields)
    .from(laundries)
    .leftJoin(rooms, eq(laundries.roomId, rooms.id))
    .all();
}

/**
 * `laundries`テーブルから`id`が合致する`Laundry`を取得する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns `id`が合致する`Laundry`が存在した場合はその`Laundry`, 存在しなければ`undefined`
 */
export async function getLaundryById(
  context: AppLoadContext,
  id: Laundry["id"]
): Promise<LaundryWithRoom | undefined> {
  return getClient(context)
    .select(laundryWithRoomFields)
    .from(laundries)
    .leftJoin(rooms, eq(laundries.roomId, rooms.id))
    .where(eq(laundries.id, id))
    .get();
}

/**
 * 新しい`Laundry`を作成して`laundries`テーブルに挿入する
 * @param context `loader`関数で渡される`context`
 * @param roomId 新しい`Laundry`と紐づく`Room`の`id`
 * @returns 挿入された`Laundry`
 */
export async function createLaundry(
  context: AppLoadContext,
  roomId: Laundry["roomId"]
): Promise<Laundry | undefined> {
  const newLaundry: NewLaundry = { id: cuid(), roomId };

  return getClient(context)
    .insert(laundries)
    .values(newLaundry)
    .returning()
    .get();
}

/**
 * `laundries`テーブルから`id`が合致する`Laundry`を削除する
 * @param context `loader`関数で渡される`context`
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`Laundry`, 削除できなければ`undefined`
 */
export async function deleteLaundryById(
  context: AppLoadContext,
  id: Laundry["id"]
): Promise<Laundry | undefined> {
  return getClient(context)
    .delete(laundries)
    .where(eq(laundries.id, id))
    .returning()
    .get();
}
