import { Elysia, t } from "elysia";
import { authMiddleware } from "../middlewares/auth";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

// Wishlistni olish yoki yaratish helper (har doim non-null qaytaradi)
async function getOrCreateWishlist(userId: string) {
  const existing = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 },
              discount: true,
              category: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
    },
  });

  if (existing) return existing;

  return prisma.wishlist.create({
    data: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isMain: true }, take: 1 },
              discount: true,
              category: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
    },
  });
}

export const wishlistController = new Elysia({
  prefix: "/api/wishlist",
  tags: ["Wishlist"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(authMiddleware)

  // GET /api/wishlist — wishlistni ko'rish
  .get("/", async ({ user }) => {
    const wishlist = await getOrCreateWishlist(user.id);
    return { data: wishlist };
  })

  // POST /api/wishlist — mahsulot qo'shish
  .post(
    "/",
    async ({ user, body }) => {
      const { productId } = body;

      const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true },
      });
      if (!product) throw new AppError(404, "Mahsulot topilmadi!");

      const wishlist = await getOrCreateWishlist(user.id);

      const existing = await prisma.wishlistItem.findUnique({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId,
          },
        },
      });

      if (existing)
        throw new AppError(409, "Mahsulot allaqachon wishlistda mavjud!");

      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });

      const updated = await getOrCreateWishlist(user.id);
      return { data: updated };
    },
    {
      body: t.Object({
        productId: t.String({ description: "Mahsulot UUID si" }),
      }),
    },
  )

  // DELETE /api/wishlist/:id — mahsulotni wishlistdan o'chirish
  .delete(
    "/:id",
    async ({ user, params }) => {
      const wishlist = await prisma.wishlist.findUnique({
        where: { userId: user.id },
      });
      if (!wishlist) throw new AppError(404, "Wishlist topilmadi!");

      const item = await prisma.wishlistItem.findFirst({
        where: { id: params.id, wishlistId: wishlist.id },
      });
      if (!item) throw new AppError(404, "Wishlist elementi topilmadi!");

      await prisma.wishlistItem.delete({ where: { id: params.id } });

      return { message: "Mahsulot wishlistdan o'chirildi!" };
    },
    {
      params: t.Object({ id: t.String() }),
    },
  );
