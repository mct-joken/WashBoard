import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { rooms } from "./rooms";
import { InferSelectModel, InferInsertModel, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export const laundries = sqliteTable("laundries", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  roomId: text("roomId").references(() => rooms.id),
  running: integer("running", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type Laundry = InferSelectModel<typeof laundries>;
export type NewLaundry = InferInsertModel<typeof laundries>;
