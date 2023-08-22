import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { accounts } from "./accounts";
import { laundries } from "./laundries";

export const uses = sqliteTable("uses", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  accountId: integer("accountId", { mode: "number" }).references(
    () => accounts.id
  ),
  laundryId: integer("laundryId", { mode: "number" }).references(
    () => laundries.id
  ),
});
