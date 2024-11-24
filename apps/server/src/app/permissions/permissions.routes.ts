import type { EnvVariables } from "app/@shared/types/env.js";
import { getPermissions } from "domain/permissions/permissions.services/get-permissions.js";
import { Hono } from "hono";

export const permissions = new Hono<{ Variables: EnvVariables }>();

permissions.get("/", async (c) => {
  const permissions = getPermissions(c.var.db);
  return c.json(permissions);
});
