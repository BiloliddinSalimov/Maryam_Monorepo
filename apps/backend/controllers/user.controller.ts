import { Elysia, t } from "elysia";
import { authMiddleware } from "../middlewares/auth";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

export const userController = new Elysia({ prefix: "/api/user" })
  .use(authMiddleware)

  // GET /api/user/me
  .get(
    "/me",
    async ({ user }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          telegramId: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });
      if (!dbUser) throw new AppError(404, "Foydalanuvchi topilmadi!");
      return { user: dbUser };
    },
    {
      tags: ["User"],
      detail: {
        summary: "O'z profilini ko'rish",
        security: [{ BearerAuth: [] }],
      },
    }
  )

  // PUT /api/user/me
  .put(
    "/me",
    async ({ user, body }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!dbUser) throw new AppError(404, "Foydalanuvchi topilmadi!");

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: body.firstName ?? dbUser.firstName,
          lastName: body.lastName !== undefined ? body.lastName : dbUser.lastName,
          username: body.username !== undefined ? body.username : dbUser.username,
          phone: body.phone !== undefined ? body.phone : dbUser.phone,
        },
        select: {
          id: true,
          telegramId: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      return { user: updated };
    },
    {
      tags: ["User"],
      detail: {
        summary: "Profilni yangilash",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        firstName: t.Optional(t.String({ minLength: 1 })),
        lastName: t.Optional(t.Nullable(t.String())),
        username: t.Optional(t.Nullable(t.String())),
        phone: t.Optional(t.Nullable(t.String())),
      }),
    }
  );
