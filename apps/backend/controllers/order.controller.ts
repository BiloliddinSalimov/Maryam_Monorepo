import { Elysia, t } from "elysia";
import { authMiddleware } from "../middlewares/auth";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

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
};

export const orderController = new Elysia({
  prefix: "/api/orders",
  tags: ["Orders"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(authMiddleware)

  // GET /api/orders — o'z orderlarini ko'rish
  .get(
    "/",
    async ({ user, query }) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      const [total, orders] = await Promise.all([
        prisma.order.count({ where: { userId: user.id } }),
        prisma.order.findMany({
          where: { userId: user.id },
          include: orderInclude,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
      ]);

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
      }),
    },
  )

  // POST /api/orders — basketdan order yaratish
  .post(
    "/",
    async ({ user, body }) => {
      const userId = user.id;

      // Basketni ol
      const basket = await prisma.basket.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!basket || basket.items.length === 0)
        throw new AppError(400, "Basket bo'sh! Avval mahsulot qo'shing.");

      // Stock tekshirish va umumiy narxni hisoblash
      let totalPrice = 0;
      for (const item of basket.items) {
        if (!item.product.isActive) {
          throw new AppError(
            400,
            `"${item.product.name}" mahsuloti hozir mavjud emas!`,
          );
        }
        if (item.product.stock < item.quantity) {
          throw new AppError(
            400,
            `"${item.product.name}" mahsulotidan faqat ${item.product.stock} ta qolgan!`,
          );
        }
        totalPrice += item.product.price * item.quantity;
      }

      // Order yaratish va stock kamaytirish — transaction ichida
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            userId,
            totalPrice,
            address: body.address ?? null,
            phone: body.phone ?? null,
            note: body.note ?? null,
            items: {
              create: basket.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
          include: orderInclude,
        });

        // Stock kamaytirish
        for (const item of basket.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Basketni tozalash
        await tx.basketItem.deleteMany({ where: { basketId: basket.id } });

        return newOrder;
      });

      return { data: order };
    },
    {
      body: t.Object({
        address: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        note: t.Optional(t.String()),
      }),
    },
  );
