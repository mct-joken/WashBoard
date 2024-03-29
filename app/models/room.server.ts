import { eq } from "drizzle-orm";
import { getClient } from "~/db/client.server";
import { NewRoom, Room, rooms } from "~/db/schema";

/**
 * `rooms`テーブルから全ての`Room`を取得する
 * @returns 取得した`Room`の配列
 */
export async function getRooms(): Promise<Room[]> {
  return getClient().select().from(rooms).all();
}

/**
 * `rooms`テーブルから`id`が合致する`Room`を取得する
 * @param id 検索するid
 * @returns `id`が合致する`Room`が存在した場合はその`Room`, 存在しなければ`undefined`
 */
export async function getRoomById(id: Room["id"]): Promise<Room | undefined> {
  return getClient().select().from(rooms).where(eq(rooms.id, id)).get();
}

/**
 * `rooms`テーブルから`place`が合致する`Room`を取得する
 * @param place 検索する場所名
 * @returns `place`が合致する`Room`が存在した場合はその`Room`, 存在しなければ`undefined`
 */
export async function getRoomByPlace(
  place: Room["place"]
): Promise<Room | undefined> {
  return getClient().select().from(rooms).where(eq(rooms.place, place)).get();
}

/**
 * 新しい`Room`を作成して`rooms`テーブルに挿入する
 * @param place 新しい`Room`の場所名
 * @returns 挿入された`Room`
 */
export async function createRoom(
  place: Room["place"]
): Promise<Room | undefined> {
  const newRoom: NewRoom = { place };

  return getClient().insert(rooms).values(newRoom).returning().get();
}

/**
 * `rooms`テーブルから`id`が合致する`Room`を削除する
 * @param id 検索するid
 * @returns 削除できた場合はその削除された`Room`, 削除できなければ`undefined`
 */
export async function deleteRoomById(
  id: Room["id"]
): Promise<Room | undefined> {
  return getClient().delete(rooms).where(eq(rooms.id, id)).returning().get();
}

/**
 * `rooms`テーブルから`place`が合致する`Room`を削除する
 * @param place 検索する場所名
 * @returns 削除できた場合はその削除された`Room`, 削除できなければ`undefined`
 */
export async function deleteRoomByPlace(
  place: Room["place"]
): Promise<Room | undefined> {
  return getClient()
    .delete(rooms)
    .where(eq(rooms.place, place))
    .returning()
    .get();
}
