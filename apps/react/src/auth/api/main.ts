import { client } from "@shared/api/client";
import type { LoginPayload, LogoutPayload, PermissionType } from "@repo/dto/main";

export const loginApi = (params: LoginPayload) =>
  client
    .post("auth/login", {
      json: params,
    })
    .json<{ token: string }>();

export const logoutApi = (params: LogoutPayload) =>
  client.post("auth/logout", {
    json: { id: params.id },
  });

export const getPermissionsApi = async (signal?: AbortSignal) =>
  client.get("permissions", { signal }).json<PermissionType[]>();
