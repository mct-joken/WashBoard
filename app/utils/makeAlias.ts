import type { Column } from "drizzle-orm";
import { SQL, getTableName, sql } from "drizzle-orm";

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
  const uniqueName = `__${tableName}_${columnName}__`;
  return new SQL.Aliased<TData>(sql.raw(fullName), uniqueName);
};
