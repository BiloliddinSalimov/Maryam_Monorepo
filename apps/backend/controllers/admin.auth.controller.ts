import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";
import { Timer } from "../lib/timer";

export const adminAuthController = new Elysia({ prefix: "/admin/auth" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "secret-key" }))

  // POST /admin/auth/login — faqat ADMIN role kirishi mumkin
  .post(
    "/login",
    async ({ body, jwt }) => {
      const timer = new Timer("POST /admin/auth/login");

      const { email, password } = body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) throw new AppError(401, "Email yoki parol noto'g'ri!");
      if (user.role !== "ADMIN") throw new AppError(403, "Sizda admin huquqi yo'q!");
      timer.step("findUser");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new AppError(401, "Email yoki parol noto'g'ri!");
      timer.step("bcrypt");

      const token = await jwt.sign({
        id: String(user.id),
        telegramId: user.telegramId ?? "",
      });
      timer.step("jwt-sign");
      timer.done();

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    },
    {
      tags: ["Admin Auth"],
      detail: {
        summary: "Admin login (faqat ADMIN role)",
        security: [],
      },
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
      }),
    }
  );
