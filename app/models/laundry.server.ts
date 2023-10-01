import { eq } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import type { Laundry, NewLaundry, Room } from "~/db/schema";
import { LaundryColumns, RoomColumns, laundries, rooms } from "~/db/schema";

const laundryWithRoomFields = {
  ...LaundryColumns,
  room: RoomColumns,
};

type LaundryWithRoom = Omit<Laundry & { room: Room | null }, "roomId">;

/**
 * `laundries`テーブルから全ての`Laundry`を取得する
 * @returns 取得した`Laundry`の配列
 */
export async function getLaundries(): Promise<LaundryWithRoom[]> {
  return getClient()
    .select(laundryWithRoomFields)
    .from(laundries)
    .leftJoin(rooms, eq(laundries.roomId, rooms.id))
    .all();
}

/**
 * `laundries`テーブルから`id`が合致する`Laundry`を取得する
 * @param id 検索するid
 * @returns `id`が合致する`Laundry`が存在した場合はその`Laundry`, 存在しなければ`undefined`
 */
export async function getLaundryById(
  id: Laundry["id"]
): Promise<LaundryWithRoom | undefined> {
  return getClient()
    .select(laundryWithRoomFields)
    .from(laundries)
    .leftJoin(rooms, eq(laundries.roomId, rooms.id))
    .where(eq(laundries.id, id))
    .get();
}

/**
 * 新しい`Laundry`を作成して`laundries`テーブルに挿入する
 * @param roomId 新しい`Laundry`と紐づく`Room`の`id`
 * @returns 挿入された`Laundry`
 */
export async function createLaundry(
  roomId: Laundry["roomId"]
): Promise<Laundry | undefined> {
  const newLaundry: NewLaundry = { roomId };

  return getClient().insert(laundries).values(newLaundry).returning().get();
}

/**
 * `laundries`テーブルの`id`が合致する`Laundry`を更新する
 * @param laundry 更新する`Laundry`
 * @returns 更新された`Laundry`
 */
export async function updateLaundry(laundry: {
  id: Laundry["id"];
  running?: Laundry["running"];
}): Promise<Laundry | undefined> {
  const { id, running } = laundry;
  return getClient()
    .update(laundries)
    .set({ running, updatedAt: new Date() })
    .where(eq(laundries.id, id))
    .returning()
    .get();
}

/**
 * `laundries`テーブルから`id`が合致する`Laundry`を削除する
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`Laundry`, 削除できなければ`undefined`
 */
export async function deleteLaundryById(
  id: Laundry["id"]
): Promise<Laundry | undefined> {
  return getClient()
    .delete(laundries)
    .where(eq(laundries.id, id))
    .returning()
    .get();
}
