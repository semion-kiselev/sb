import { omit, toCamelCase } from "domain/@shared/utils/lib.js";
import { type User, type UserWithPermissionsFromDb } from "domain/users/users.types.js";

type NormalizeUserParams = {
  omitCredProps?: boolean;
};

export const normalizeUser = (
  user:
    | UserWithPermissionsFromDb
    | (Omit<UserWithPermissionsFromDb, "permissions"> & { permissions: string[] }),
  { omitCredProps = true }: NormalizeUserParams = {}
) => {
  const omittedUser = omitCredProps ? omit(user, ["token_expired_at", "password"]) : user;

  const userWithPermissions = {
    ...omittedUser,
    permissions:
      typeof omittedUser.permissions === "string"
        ? JSON.parse(omittedUser.permissions)
        : omittedUser.permissions,
  };

  return toCamelCase(userWithPermissions) as User;
};
