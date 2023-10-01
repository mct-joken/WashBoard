import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { sql, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import type { AliasedColumns } from "~/types/aliasedColumns";
import { makeAlias } from "~/utils/makeAlias";
import { laundries } from "./laundries";

export const rooms = sqliteTable("rooms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  place: text("place").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export const roomsRelations = relations(rooms, ({ many }) => ({
  laundries: many(laundries),
}));

export type Room = InferSelectModel<typeof rooms>;
export type NewRoom = InferInsertModel<typeof rooms>;
export const RoomColumns: AliasedColumns<Room> = {
  id: makeAlias(rooms.id),
  place: makeAlias(rooms.place),
  createdAt: makeAlias(rooms.createdAt),
  updatedAt: makeAlias(rooms.updatedAt),
};
