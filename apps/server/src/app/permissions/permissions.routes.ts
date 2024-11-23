import { getPermissions } from "domain/permissions/permissions.services/get-permissions";
import { Hono } from "hono";
import type { EnvVariables } from "../@shared/types/env";

export const permissions = new Hono<{ Variables: EnvVariables }>();

permissions.get("/", async (c) => {
  const permissions = getPermissions(c.var.db);
  return c.json(permissions);
});
