import type { Database } from "better-sqlite3";
import type { User, UserWithPermissionsFromDb } from "domain/users/users.types.js";
import { normalizeUser } from "domain/users/users.utils.js";

const getUserSql = `
  SELECT id, name, email, created_at, updated_at, json_group_array(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE id = ?
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUser = (db: Database, id: number, raiseNotFound: () => never) => {
  const user = db.prepare<number, UserWithPermissionsFromDb>(getUserSql).get(id);

  if (!user) {
    raiseNotFound();
  }

  return normalizeUser(user) as User;
};
