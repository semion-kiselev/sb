import { db } from "db/connection.js";
import { toCamelCase } from "domain/@shared/utils/lib.js";
import type { User, UserWithPermissionsFromDb } from "domain/users/users.types.js";

const getUserSql = `
  SELECT id, name, email, created_at, updated_at, json_group_array(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE id = ?
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUser = (id: number, raiseNotFound: () => never) => {
  const user = db.prepare<number, UserWithPermissionsFromDb>(getUserSql).get(id);

  if (!user) {
    raiseNotFound();
  }

  return toCamelCase(user) as User;
};
