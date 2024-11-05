import { db } from "db/connection";
import type { LogoutPayload } from "domain/auth/auth.types";

export const logout = ({ id }: LogoutPayload) => {
  db.prepare<number>("UPDATE employee SET token_expired_at=datetime() WHERE id = ?").run(id);
  return {};
};
