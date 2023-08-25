import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { rooms } from "./rooms";
import { InferModel, sql } from "drizzle-orm";

export const laundries = sqliteTable("laundries", {
  id: text("id").primaryKey(),
  roomId: text("roomId").references(() => rooms.id),
  running: integer("running", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type Laundry = InferModel<typeof laundries>;
export type NewLaundry = InferModel<typeof laundries, "insert">;
