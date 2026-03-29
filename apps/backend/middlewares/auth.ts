import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AppError } from "../lib/errors";
import type { JwtPayload } from "../lib/types";

export const authMiddleware = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "secret-key",
    }),
  )
  .derive(
    { as: "scoped" },
    async ({ jwt, headers }): Promise<{ user: JwtPayload }> => {
      const authHeader = headers.authorization ?? "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
      if (!token) throw new AppError(401, "Token yo'q!");
      const payload = await jwt.verify(token);
      if (!payload) throw new AppError(401, "Token yaroqsiz!");
      return { user: payload as unknown as JwtPayload };
    },
  );
