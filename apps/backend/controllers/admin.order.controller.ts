import { Elysia, t } from "elysia";
import { adminMiddleware } from "../middlewares/admin";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";
import { Timer } from "../lib/timer";

const orderInclude = {
  items: {
    include: {
      product: {
        include: {
          images: { where: { isMain: true }, take: 1 },
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      telegramId: true,
    },
  },
};

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

export const adminOrderController = new Elysia({
  prefix: "/admin/orders",
  tags: ["Admin Orders"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(adminMiddleware)

  // GET /admin/orders — barcha orderlar (pagination + filter)
  .get(
    "/",
    async ({ query }) => {
      const timer = new Timer("GET /admin/orders");

      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 20;
      const skip = (page - 1) * limit;
      const status = query.status as OrderStatus | undefined;

      const where = status ? { status } : {};

      const [total, orders] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.findMany({
          where,
          include: orderInclude,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
      ]);
      timer.step("findMany+count");
      timer.done();

      return {
        data: orders,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        status: t.Optional(
          t.Union([
            t.Literal("PENDING"),
            t.Literal("CONFIRMED"),
            t.Literal("SHIPPING"),
            t.Literal("DELIVERED"),
            t.Literal("CANCELLED"),
          ])
        ),
      }),
    }
  )

  // PUT /admin/orders/:id/status — order statusini yangilash
  .put(
    "/:id/status",
    async ({ params, body }) => {
      const timer = new Timer(`PUT /admin/orders/${params.id}/status`);

      const order = await prisma.order.findUnique({
        where: { id: params.id },
      });
      if (!order) throw new AppError(404, "Order topilmadi!");

      if (order.status === "DELIVERED" || order.status === "CANCELLED") {
        throw new AppError(400, "Bu order endi o'zgartirib bo'lmaydi!");
      }
      timer.step("validation");

      const updated = await prisma.order.update({
        where: { id: params.id },
        data: { status: body.status as OrderStatus },
        include: orderInclude,
      });
      timer.step("update+include");
      timer.done();

      return { data: updated };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        status: t.Union([
          t.Literal("PENDING"),
          t.Literal("CONFIRMED"),
          t.Literal("SHIPPING"),
          t.Literal("DELIVERED"),
          t.Literal("CANCELLED"),
        ]),
      }),
    }
  );
