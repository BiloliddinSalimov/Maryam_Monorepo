import { Elysia, t } from "elysia";
import { authMiddleware } from "../middlewares/auth";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

// Basketni olish yoki yaratish helper (har doim non-null qaytaradi)
async function getOrCreateBasket(userId: string) {
  const existing = await prisma.basket.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 },
              discount: true,
            },
          },
        },
      },
    },
  });

  if (existing) return existing;

  return prisma.basket.create({
    data: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 },
              discount: true,
            },
          },
        },
      },
    },
  });
}

export const basketController = new Elysia({
  prefix: "/api/basket",
  tags: ["Basket"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(authMiddleware)

  // GET /api/basket — basketni ko'rish
  .get("/", async ({ user }) => {
    const basket = await getOrCreateBasket(user.id);
    return { data: basket };
  })

  // POST /api/basket — mahsulot qo'shish yoki miqdorni yangilash
  .post(
    "/",
    async ({ user, body }) => {
      const { productId, quantity } = body;

      const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true },
      });
      if (!product) throw new AppError(404, "Mahsulot topilmadi!");
      if (product.stock < quantity)
        throw new AppError(400, "Omborda yetarli mahsulot yo'q!");

      const basket = await getOrCreateBasket(user.id);

      await prisma.basketItem.upsert({
        where: {
          basketId_productId: {
            basketId: basket.id,
            productId,
          },
        },
        update: { quantity },
        create: {
          basketId: basket.id,
          productId,
          quantity,
        },
      });

      const updated = await getOrCreateBasket(user.id);
      return { data: updated };
    },
    {
      body: t.Object({
        productId: t.String({ description: "Mahsulot UUID si" }),
        quantity: t.Number({ minimum: 1 }),
      }),
    },
  )

  // DELETE /api/basket/:itemId — mahsulotni basketdan o'chirish
  .delete(
    "/:itemId",
    async ({ user, params }) => {
      const basket = await prisma.basket.findUnique({
        where: { userId: user.id },
      });
      if (!basket) throw new AppError(404, "Basket topilmadi!");

      const item = await prisma.basketItem.findFirst({
        where: { id: params.itemId, basketId: basket.id },
      });
      if (!item) throw new AppError(404, "Basket elementi topilmadi!");

      await prisma.basketItem.delete({ where: { id: params.itemId } });

      return { message: "Mahsulot basketdan o'chirildi!" };
    },
    {
      params: t.Object({ itemId: t.String() }),
    },
  );
