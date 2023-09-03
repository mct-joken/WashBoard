import { InferSelectModel, InferInsertModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accounts } from "./accounts";
import { laundries } from "./laundries";

export const useHistories = sqliteTable("useHistories", {
  id: text("id").primaryKey(),
  accountId: text("accountId").references(() => accounts.id),
  laundryId: text("laundryId").references(() => laundries.id),
  startAt: integer("startAt", { mode: "timestamp_ms" }).notNull(),
  endAt: integer("endAt", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type UseHistory = InferSelectModel<typeof useHistories>;
export type NewUseHistory = InferInsertModel<typeof useHistories>;
