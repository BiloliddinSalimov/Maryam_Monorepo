import { Elysia, t } from "elysia";
import { adminMiddleware } from "../middlewares/admin";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";
import { Timer } from "../lib/timer";

const SECTION_TYPES = ["BANNER", "CATEGORY_LIST", "PRODUCT_LIST", "PROMO_BLOCK"] as const;

export const adminHomepageController = new Elysia({
  prefix: "/admin/homepage",
  tags: ["Admin Homepage"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(adminMiddleware)

  // ── GET /admin/homepage/sections ─────────────────────────────────────────
  .get("/sections", async () => {
    const timer = new Timer("GET /admin/homepage/sections");

    const sections = await prisma.homepageSection.findMany({
      orderBy: { order: "asc" },
    });
    timer.step("findMany");
    timer.done();

    return {
      data: sections.map((s) => ({ ...s, config: parseConfig(s.config) })),
    };
  })

  // ── GET /admin/homepage/sections/:id ─────────────────────────────────────
  .get(
    "/sections/:id",
    async ({ params }) => {
      const timer = new Timer(`GET /admin/homepage/sections/${params.id}`);

      const section = await prisma.homepageSection.findUnique({ where: { id: params.id } });
      if (!section) throw new AppError(404, "Section topilmadi!");
      timer.step("findUnique");
      timer.done();

      return { data: { ...section, config: parseConfig(section.config) } };
    },
    { params: t.Object({ id: t.String() }) }
  )

  // ── POST /admin/homepage/sections ────────────────────────────────────────
  .post(
    "/sections",
    async ({ body }) => {
      const timer = new Timer("POST /admin/homepage/sections");

      if (!SECTION_TYPES.includes(body.type as (typeof SECTION_TYPES)[number])) {
        throw new AppError(400, `Type noto'g'ri! Ruxsat etilganlar: ${SECTION_TYPES.join(", ")}`);
      }

      const last = await prisma.homepageSection.findFirst({ orderBy: { order: "desc" } });
      const nextOrder = (last?.order ?? -1) + 1;
      timer.step("validation");

      const section = await prisma.homepageSection.create({
        data: {
          type: body.type,
          title: body.title ?? null,
          order: body.order ?? nextOrder,
          isActive: body.isActive ?? true,
          config: JSON.stringify(body.config ?? {}),
        },
      });
      timer.step("create");
      timer.done();

      return {
        message: "Section muvaffaqiyatli yaratildi!",
        data: { ...section, config: parseConfig(section.config) },
      };
    },
    {
      body: t.Object({
        type: t.String({ description: "BANNER | CATEGORY_LIST | PRODUCT_LIST | PROMO_BLOCK" }),
        title: t.Optional(
          t.Any({ description: '{ "uz": "Yangi mahsulotlar", "ru": "Новые товары", "en": "New products" }' })
        ),
        order: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean()),
        config: t.Optional(t.Any({ description: "JSON object — section turi bo'yicha konfiguratsiya" })),
      }),
    }
  )

  // ── PUT /admin/homepage/sections/:id ─────────────────────────────────────
  .put(
    "/sections/:id",
    async ({ params, body }) => {
      const timer = new Timer(`PUT /admin/homepage/sections/${params.id}`);

      const section = await prisma.homepageSection.findUnique({ where: { id: params.id } });
      if (!section) throw new AppError(404, "Section topilmadi!");

      if (body.type && !SECTION_TYPES.includes(body.type as (typeof SECTION_TYPES)[number])) {
        throw new AppError(400, `Type noto'g'ri! Ruxsat etilganlar: ${SECTION_TYPES.join(", ")}`);
      }
      timer.step("validation");

      const updated = await prisma.homepageSection.update({
        where: { id: params.id },
        data: {
          type: body.type ?? section.type,
          title: body.title !== undefined ? body.title : section.title,
          order: body.order !== undefined ? body.order : section.order,
          isActive: body.isActive !== undefined ? body.isActive : section.isActive,
          config: body.config !== undefined ? JSON.stringify(body.config) : section.config,
        },
      });
      timer.step("update");
      timer.done();

      return {
        message: "Section yangilandi!",
        data: { ...updated, config: parseConfig(updated.config) },
      };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        type: t.Optional(t.String({ description: "BANNER | CATEGORY_LIST | PRODUCT_LIST | PROMO_BLOCK" })),
        title: t.Optional(t.Nullable(t.Any({ description: '{ "uz": "...", "ru": "...", "en": "..." }' }))),
        order: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean()),
        config: t.Optional(t.Any()),
      }),
    }
  )

  // ── PATCH /admin/homepage/sections/:id/toggle ─────────────────────────────
  .patch(
    "/sections/:id/toggle",
    async ({ params }) => {
      const timer = new Timer(`PATCH /admin/homepage/sections/${params.id}/toggle`);

      const section = await prisma.homepageSection.findUnique({ where: { id: params.id } });
      if (!section) throw new AppError(404, "Section topilmadi!");
      timer.step("validation");

      const updated = await prisma.homepageSection.update({
        where: { id: params.id },
        data: { isActive: !section.isActive },
      });
      timer.step("update");
      timer.done();

      return {
        message: `Section ${updated.isActive ? "yoqildi" : "o'chirildi"}!`,
        data: { ...updated, config: parseConfig(updated.config) },
      };
    },
    { params: t.Object({ id: t.String() }) }
  )

  // ── PUT /admin/homepage/sections/reorder ─────────────────────────────────
  .put(
    "/sections/reorder",
    async ({ body }) => {
      const timer = new Timer("PUT /admin/homepage/sections/reorder");

      if (!Array.isArray(body.sections) || body.sections.length === 0) {
        throw new AppError(400, "sections array bo'sh bo'lmasligi kerak!");
      }

      await prisma.$transaction(
        body.sections.map((item: { id: string; order: number }) =>
          prisma.homepageSection.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );
      timer.step("transaction");
      timer.done();

      return { message: "Tartib muvaffaqiyatli yangilandi!" };
    },
    {
      body: t.Object({
        sections: t.Array(
          t.Object({ id: t.String(), order: t.Number() }),
          { description: "[ { id, order }, ... ] — yangi tartib" }
        ),
      }),
    }
  )

  // ── DELETE /admin/homepage/sections/:id ──────────────────────────────────
  .delete(
    "/sections/:id",
    async ({ params }) => {
      const timer = new Timer(`DELETE /admin/homepage/sections/${params.id}`);

      const section = await prisma.homepageSection.findUnique({ where: { id: params.id } });
      if (!section) throw new AppError(404, "Section topilmadi!");
      timer.step("validation");

      await prisma.homepageSection.delete({ where: { id: params.id } });
      timer.step("delete");
      timer.done();

      return { message: "Section muvaffaqiyatli o'chirildi!" };
    },
    { params: t.Object({ id: t.String() }) }
  );

function parseConfig(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
