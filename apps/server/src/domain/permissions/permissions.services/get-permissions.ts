import { db } from "db/connection";
import type { Permission } from "domain/permissions/permissions.types.js";

export const getPermissions = () =>
  db.prepare<unknown[], Permission>("SELECT id, name FROM permission").all();
