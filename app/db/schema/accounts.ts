import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable(
  "accounts",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    role: integer("role", { mode: "number" }).default(1), // 1: User, 2: Admin
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
  },
  (accounts) => ({ emailIdx: uniqueIndex("emailIdx").on(accounts.email) })
);