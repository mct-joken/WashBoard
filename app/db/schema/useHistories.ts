import { sql } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { accounts } from "./accounts";
import { laundries } from "./laundries";

export const useHistories = sqliteTable("useHistories", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  accountId: integer("accountId", { mode: "number" }).references(
    () => accounts.id
  ),
  laundryId: integer("laundryId", { mode: "number" }).references(
    () => laundries.id
  ),
  startAt: integer("startAt", { mode: "timestamp_ms" }).notNull(),
  endAt: integer("endAt", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});
