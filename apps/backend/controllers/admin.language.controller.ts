import { Elysia, t } from "elysia";
import { adminMiddleware } from "../middlewares/admin";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";
import { Timer } from "../lib/timer";

export const adminLanguageController = new Elysia({
  prefix: "/admin/languages",
  tags: ["Admin Languages"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(adminMiddleware)

  // ── GET /admin/languages — mavjud tillar ─────────────────────────────────
  .get("/", async () => {
    const timer = new Timer("GET /admin/languages");

    const languages = await prisma.language.findMany({
      orderBy: { createdAt: "asc" },
    });
    timer.step("findMany");
    timer.done();

    return { data: languages };
  })

  // ── POST /admin/languages — yangi til qo'shish ───────────────────────────
  .post(
    "/",
    async ({ body }) => {
      const timer = new Timer("POST /admin/languages");

      if (body.isDefault) {
        await prisma.language.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const language = await prisma.language.create({
        data: {
          code: body.code.trim().toLowerCase(),
          name: body.name.trim(),
          isDefault: body.isDefault ?? false,
          isActive: body.isActive ?? true,
        },
      });
      timer.step("create");
      timer.done();

      return { data: language };
    },
    {
      body: t.Object({
        code: t.String({
          minLength: 2,
          maxLength: 10,
          description: 'Til kodi — "uz", "ru", "en", "tr" va h.k.',
        }),
        name: t.String({
          minLength: 1,
          description: "Til nomi — \"O'zbek\", \"Русский\", \"English\"",
        }),
        isDefault: t.Optional(t.Boolean({ description: "Asosiy til (faqat bitta bo'lishi mumkin)" })),
        isActive: t.Optional(t.Boolean()),
      }),
    }
  )

  // ── PUT /admin/languages/:id — tilni yangilash ───────────────────────────
  .put(
    "/:id",
    async ({ params, body }) => {
      const timer = new Timer(`PUT /admin/languages/${params.id}`);

      const language = await prisma.language.findUnique({ where: { id: params.id } });
      if (!language) throw new AppError(404, "Til topilmadi!");

      if (body.isDefault) {
        await prisma.language.updateMany({
          where: { isDefault: true, NOT: { id: params.id } },
          data: { isDefault: false },
        });
      }
      timer.step("validation");

      const updated = await prisma.language.update({
        where: { id: params.id },
        data: {
          code: body.code ? body.code.trim().toLowerCase() : language.code,
          name: body.name ? body.name.trim() : language.name,
          isDefault: body.isDefault ?? language.isDefault,
          isActive: body.isActive ?? language.isActive,
        },
      });
      timer.step("update");
      timer.done();

      return { data: updated };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        code: t.Optional(t.String({ minLength: 2, maxLength: 10 })),
        name: t.Optional(t.String({ minLength: 1 })),
        isDefault: t.Optional(t.Boolean()),
        isActive: t.Optional(t.Boolean()),
      }),
    }
  )

  // ── DELETE /admin/languages/:id — tilni o'chirish ────────────────────────
  .delete(
    "/:id",
    async ({ params }) => {
      const timer = new Timer(`DELETE /admin/languages/${params.id}`);

      const language = await prisma.language.findUnique({ where: { id: params.id } });
      if (!language) throw new AppError(404, "Til topilmadi!");
      if (language.isDefault) throw new AppError(400, "Default tilni o'chirib bo'lmaydi!");
      timer.step("validation");

      await prisma.language.delete({ where: { id: params.id } });
      timer.step("delete");
      timer.done();

      return { message: "Til muvaffaqiyatli o'chirildi!" };
    },
    { params: t.Object({ id: t.String() }) }
  );
