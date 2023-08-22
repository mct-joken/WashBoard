import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  place: text("place").notNull().unique(),
});
