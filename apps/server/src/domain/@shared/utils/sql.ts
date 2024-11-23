import type { Database } from "better-sqlite3";

export const getUpdateSqlWithValues = (
  sql: string,
  keyValueMap: Record<string, unknown>
): [string, unknown[]] => {
  const values: unknown[] = [];

  const updateString = Object.entries(keyValueMap)
    .filter((value) => typeof value !== "undefined")
    .map(([key, value]) => {
      if (value === "datetime()") {
        return `${key}=${value}`;
      }
      values.push(value);
      return `${key}=?`;
    })
    .join(", ");

  return [sql.replace("%s", updateString), values];
};

const addPermissionsSql = `
  INSERT INTO employee_permission (employee_id, permission_id) 
  VALUES (?, ?);
`;

export const insertUserPermissions = (db: Database, userId: number, permissions: string[]) => {
  const userPermissionsMap = permissions.map((p) => [userId, p]);
  const insertPermissions = db.prepare(addPermissionsSql);

  userPermissionsMap.forEach((row) => {
    insertPermissions.run(...row);
  });
};
