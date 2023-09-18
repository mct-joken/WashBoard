import {
  InferSelectModel,
  InferInsertModel,
  sql,
  relations,
} from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { AliasedColumns } from "~/types/aliasedColumns";
import { makeAlias } from "~/utils/makeAlias";
import { uses } from "./uses";
import { useHistories } from "./useHistories";

export const accounts = sqliteTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  email: text("email").notNull().unique(),
  role: integer("role", { mode: "number" }).default(1), // 1: User, 2: Admin
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  uses: many(uses),
  useHistories: many(useHistories),
}));

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;
export const AccountColumns: AliasedColumns<Account> = {
  id: makeAlias(accounts.id),
  email: makeAlias(accounts.email),
  role: makeAlias(accounts.role),
  createdAt: makeAlias(accounts.createdAt),
  updatedAt: makeAlias(accounts.updatedAt),
};
