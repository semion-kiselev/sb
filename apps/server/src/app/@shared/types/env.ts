import type { TokenUser } from "@repo/dto/main.ts";
import type { Database } from "better-sqlite3";

export type EnvVariables = {
  user?: TokenUser;
  db: Database;
};
