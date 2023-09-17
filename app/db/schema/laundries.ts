import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { rooms } from "./rooms";
import { InferSelectModel, InferInsertModel, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { AliasedColumns } from "~/types/aliasedColumns";
import { makeAlias } from "~/utils/makeAlias";

export const laundries = sqliteTable("laundries", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  roomId: text("roomId").references(() => rooms.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  running: integer("running", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type Laundry = InferSelectModel<typeof laundries>;
export type NewLaundry = InferInsertModel<typeof laundries>;
export const LaundryColumns: AliasedColumns<Laundry> = {
  id: makeAlias(laundries.id),
  roomId: makeAlias(laundries.roomId),
  createdAt: makeAlias(laundries.createdAt),
  updatedAt: makeAlias(laundries.updatedAt),
  running: makeAlias(laundries.running),
};
