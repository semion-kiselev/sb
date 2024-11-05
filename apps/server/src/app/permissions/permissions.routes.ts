import { getPermissions } from "domain/permissions/permissions.services/get-permissions";
import { Hono } from "hono";

export const permissions = new Hono();

permissions.get("/", async (c) => {
  const permissions = getPermissions();
  return c.json(permissions);
});
