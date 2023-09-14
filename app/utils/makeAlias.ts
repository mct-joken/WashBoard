import { Column, SQL, getTableName, sql } from "drizzle-orm";

export const makeAlias = <TData>(
  column: Column<{
    data: TData;
    columnType: any;
    dataType: any;
    driverParam: any;
    enumValues: any;
    hasDefault: any;
    name: any;
    notNull: any;
    tableName: any;
  }>
): SQL.Aliased<TData> => {
  const columnName = column.name;
  const tableName = getTableName(column.table);
  const fullName = `"${tableName}"."${columnName}"`;
  return sql<TData>`${fullName}`.as(`__${tableName}_${columnName}`);
};
