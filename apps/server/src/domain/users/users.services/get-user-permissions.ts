import { db } from "db/connection.js";

const getUserPermissionsSql = `
  SELECT json_group_array(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE id = ?
`;

export const getUserPermissions = (userId: number) => {
  const result = db.prepare<number, { permissions: string[] }>(getUserPermissionsSql).get(userId);
  console.log({ result });
  return result ? result.permissions : [];
};
