import type { Database } from "better-sqlite3";

const getUserPermissionsSql = `
  SELECT json_group_array(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE id = ?
`;

export const getUserPermissions = (db: Database, userId: number) => {
  const result = db.prepare<number, { permissions: string }>(getUserPermissionsSql).get(userId);
  return result ? JSON.parse(result.permissions) : [];
};
