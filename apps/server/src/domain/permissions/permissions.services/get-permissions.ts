import type { PermissionType } from "@repo/dto/main.js";
import type { Database } from "better-sqlite3";

export const getPermissions = (db: Database) =>
  db.prepare<unknown[], PermissionType>("SELECT id, name FROM permission").all();
