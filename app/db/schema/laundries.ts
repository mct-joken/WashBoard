import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { rooms } from "./rooms";
import { sql } from "drizzle-orm";

export const laundries = sqliteTable("laundries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  roomId: integer("room_id", { mode: "number" }).references(() => rooms.id),
  running: integer("running", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});
