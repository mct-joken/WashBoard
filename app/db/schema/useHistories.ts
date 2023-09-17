import { InferSelectModel, InferInsertModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accounts } from "./accounts";
import { laundries } from "./laundries";
import { nanoid } from "nanoid";
import { AliasedColumns } from "~/types/aliasedColumns";
import { makeAlias } from "~/utils/makeAlias";

export const useHistories = sqliteTable("useHistories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  accountId: text("accountId").references(() => accounts.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  laundryId: text("laundryId").references(() => laundries.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  startAt: integer("startAt", { mode: "timestamp_ms" }).notNull(),
  endAt: integer("endAt", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type UseHistory = InferSelectModel<typeof useHistories>;
export type NewUseHistory = InferInsertModel<typeof useHistories>;
export const UseHistoryColumns: AliasedColumns<UseHistory> = {
  id: makeAlias(useHistories.id),
  accountId: makeAlias(useHistories.accountId),
  createdAt: makeAlias(useHistories.createdAt),
  updatedAt: makeAlias(useHistories.updatedAt),
  laundryId: makeAlias(useHistories.laundryId),
  startAt: makeAlias(useHistories.startAt),
  endAt: makeAlias(useHistories.endAt),
};
