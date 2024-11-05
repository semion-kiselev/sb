import { db } from "db/connection.js";
import { toCamelCase } from "domain/@shared/utils/lib.js";
import type { User, UserWithPermissionsFromDb } from "domain/users/users.types.js";

const getUsersSql = `
  SELECT id, name, email, created_at, updated_at, json_group_array(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUsers = () => {
  const result = db.prepare<unknown[], UserWithPermissionsFromDb>(getUsersSql).all();
  console.log({ result });
  return result.map(toCamelCase) as User[];
};
