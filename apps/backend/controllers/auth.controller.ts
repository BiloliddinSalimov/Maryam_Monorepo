import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { parse, validate } from "@telegram-apps/init-data-node";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import type { TelegramUser } from "../lib/types";
import { AppError } from "../lib/errors";

export const authController = new Elysia({ prefix: "/api/auth" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "secret-key" }))

  // POST /api/auth/telegram
  .post(
    "/telegram",
    async ({ body, jwt }) => {
      try {
        validate(body.initData, process.env.BOT_TOKEN!);
        const data = parse(body.initData);
        const tgUser = data.user as unknown as TelegramUser;
        if (!tgUser) throw new AppError(400, "Telegram user topilmadi!");

        let user = await prisma.user.findUnique({
          where: { telegramId: String(tgUser.id) },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              telegramId: String(tgUser.id),
              firstName: tgUser.first_name,
              lastName: tgUser.last_name ?? null,
              username: tgUser.username ?? null,
            },
          });
        }

        const token = await jwt.sign({
          id: String(user.id),
          telegramId: user.telegramId ?? "",
        });

        return {
          token,
          user: {
            id: user.id,
            telegramId: user.telegramId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
          },
        };
      } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError(401, "initData yaroqsiz!");
      }
    },
    {
      tags: ["Auth"],
      detail: { summary: "Telegram TWA orqali login" },
      body: t.Object({
        initData: t.String({ description: "Telegram WebApp initData string" }),
      }),
    }
  )

  // POST /api/auth/register
  .post(
    "/register",
    async ({ body, jwt }) => {
      const { email, password, firstName, lastName } = body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new AppError(409, "Bu email allaqachon ro'yxatdan o'tgan!");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName: lastName ?? null,
        },
      });

      const token = await jwt.sign({
        id: String(user.id),
        telegramId: "",
      });

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
      tags: ["Auth"],
      detail: { summary: "Email orqali ro'yxatdan o'tish" },
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6, description: "Kamida 6 ta belgi" }),
        firstName: t.String({ minLength: 1 }),
        lastName: t.Optional(t.String()),
      }),
    }
  )

  // POST /api/auth/login
  .post(
    "/login",
    async ({ body, jwt }) => {
      const { email, password } = body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) throw new AppError(401, "Email yoki parol noto'g'ri!");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new AppError(401, "Email yoki parol noto'g'ri!");

      const token = await jwt.sign({
        id: String(user.id),
        telegramId: user.telegramId ?? "",
      });

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
      tags: ["Auth"],
      detail: { summary: "Email va parol bilan kirish" },
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 1 }),
      }),
    }
  );
