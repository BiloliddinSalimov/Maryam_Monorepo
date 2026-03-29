import { Elysia, t } from "elysia";
import { adminMiddleware } from "../middlewares/admin";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";
import { Timer } from "../lib/timer";

export const adminBannerController = new Elysia({
  prefix: "/admin/banners",
  tags: ["Admin Banners"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(adminMiddleware)

  // POST /admin/banners — banner qo'shish
  .post(
    "/",
    async ({ body }) => {
      const timer = new Timer("POST /admin/banners");

      const banner = await prisma.banner.create({
        data: {
          title: body.title,
          image: body.image,
          link: body.link ?? null,
          isActive: body.isActive ?? true,
          order: body.order ?? 0,
        },
      });
      timer.step("create");
      timer.done();

      return { data: banner };
    },
    {
      body: t.Object({
        title: t.Any({
          description: 'Banner sarlavhasi — { "uz": "Chegirma!", "ru": "Скидка!", "en": "Sale!" }',
        }),
        image: t.String({ minLength: 1 }),
        link: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
        order: t.Optional(t.Number()),
      }),
    }
  )

  // PUT /admin/banners/:id — bannerni yangilash
  .put(
    "/:id",
    async ({ params, body }) => {
      const timer = new Timer(`PUT /admin/banners/${params.id}`);

      const banner = await prisma.banner.findUnique({ where: { id: params.id } });
      if (!banner) throw new AppError(404, "Banner topilmadi!");
      timer.step("validation");

      const updated = await prisma.banner.update({
        where: { id: params.id },
        data: {
          ...(body.title !== undefined ? { title: body.title } : {}),
          image: body.image ?? banner.image,
          link: body.link !== undefined ? body.link : banner.link,
          isActive: body.isActive !== undefined ? body.isActive : banner.isActive,
          order: body.order !== undefined ? body.order : banner.order,
        },
      });
      timer.step("update");
      timer.done();

      return { data: updated };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(
          t.Any({ description: '{ "uz": "...", "ru": "...", "en": "..." }' })
        ),
        image: t.Optional(t.String()),
        link: t.Optional(t.Nullable(t.String())),
        isActive: t.Optional(t.Boolean()),
        order: t.Optional(t.Number()),
      }),
    }
  )

  // DELETE /admin/banners/:id — bannerni o'chirish
  .delete(
    "/:id",
    async ({ params }) => {
      const timer = new Timer(`DELETE /admin/banners/${params.id}`);

      const banner = await prisma.banner.findUnique({ where: { id: params.id } });
      if (!banner) throw new AppError(404, "Banner topilmadi!");
      timer.step("validation");

      await prisma.banner.delete({ where: { id: params.id } });
      timer.step("delete");
      timer.done();

      return { message: "Banner muvaffaqiyatli o'chirildi!" };
    },
    { params: t.Object({ id: t.String() }) }
  );
