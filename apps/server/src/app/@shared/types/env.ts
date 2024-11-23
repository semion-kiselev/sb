import type { Database } from "better-sqlite3";
import type { TokenUser } from "domain/auth/auth.types.js";

export type EnvVariables = {
  user?: TokenUser;
  db: Database;
};
