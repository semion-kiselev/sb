import type { Database } from "better-sqlite3";
import type { LoginPayload, TokenPayloadBase } from "domain/auth/auth.types.js";
import { getUserByCredentials } from "domain/users/users.services/get-user-by-credentials.js";

export const login = async (
  db: Database,
  { email, password }: LoginPayload,
  raiseNotAuthorized: () => never,
  signToken: (payload: TokenPayloadBase) => Promise<string>
) => {
  const user = await getUserByCredentials(db, email, password);

  if (!user) {
    raiseNotAuthorized();
  }

  const payload = {
    sub: user.id,
    username: user.name,
    email: user.email,
    permissions: user.permissions,
  };

  const token = await signToken(payload);

  return { token };
};
