import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { rooms } from "./rooms";

export const laundries = sqliteTable("laundries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  roomId: integer("room_id", { mode: "number" }).references(() => rooms.id),
  running: integer("running", { mode: "boolean" }).default(false),
});
