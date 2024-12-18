import { authService } from "auth/services/auth";
import ky from "ky";

const createClient = (prefixUrl: string) =>
  ky.create({
    prefixUrl,
    timeout: false,
    retry: 0,
    hooks: {
      beforeRequest: [
        (request) => {
          const token = authService.getToken();
          if (token) {
            request.headers.set("authorization", `Bearer ${token}`);
          }
        },
      ],
    },
  });

// todo: extract url to env?
export const client = createClient("http://localhost:3000");
