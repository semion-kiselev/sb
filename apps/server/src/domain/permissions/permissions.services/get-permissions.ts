import type { Database } from "better-sqlite3";
import type { Permission } from "domain/permissions/permissions.types.js";

export const getPermissions = (db: Database) =>
  db.prepare<unknown[], Permission>("SELECT id, name FROM permission").all();
