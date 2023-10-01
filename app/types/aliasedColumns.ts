import { SQL } from "drizzle-orm";

export type AliasedColumns<TModel> = {
  [Key in keyof TModel]: SQL.Aliased<TModel[Key]>;
};
