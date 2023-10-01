import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accounts } from "./accounts";
import { laundries } from "./laundries";
import {
  InferSelectModel,
  InferInsertModel,
  sql,
  relations,
} from "drizzle-orm";
import { nanoid } from "nanoid";
import { AliasedColumns } from "~/types/aliasedColumns";
import { makeAlias } from "~/utils/makeAlias";

export const uses = sqliteTable("uses", {
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
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  endAt: integer("endAt", { mode: "timestamp_ms" }),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export const usesRelations = relations(uses, ({ one }) => ({
  account: one(accounts, {
    fields: [uses.accountId],
    references: [accounts.id],
  }),
  laundry: one(laundries, {
    fields: [uses.laundryId],
    references: [laundries.id],
  }),
}));

export type Use = InferSelectModel<typeof uses>;
export type NewUse = InferInsertModel<typeof uses>;
export const UseColumns: AliasedColumns<Use> = {
  id: makeAlias(uses.id),
  accountId: makeAlias(uses.accountId),
  createdAt: makeAlias(uses.createdAt),
  endAt: makeAlias(uses.endAt),
  updatedAt: makeAlias(uses.updatedAt),
  laundryId: makeAlias(uses.laundryId),
};
