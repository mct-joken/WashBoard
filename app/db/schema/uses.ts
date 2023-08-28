import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accounts } from "./accounts";
import { laundries } from "./laundries";
import { InferModel, sql } from "drizzle-orm";

export const uses = sqliteTable("uses", {
  id: text("id").primaryKey(),
  accountId: text("accountId").references(() => accounts.id),
  laundryId: text("laundryId").references(() => laundries.id),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type Use = InferModel<typeof uses>;
export type NewUse = InferModel<typeof uses, "insert">;
