import type { User, UserWithPermissionsFromDb } from "@repo/dto/main.js";
import type { Database } from "better-sqlite3";
import { normalizeUser } from "domain/users/users.utils.js";

const getUsersSql = `
  SELECT id, name, email, created_at, updated_at, json_group_array(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUsers = (db: Database) => {
  const users = db.prepare<unknown[], UserWithPermissionsFromDb>(getUsersSql).all();
  return users.map((user) => normalizeUser(user)) as User[];
};
