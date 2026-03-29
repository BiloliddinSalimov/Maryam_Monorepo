import { Elysia, t } from "elysia";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

// Tekis ro'yxatni daraxt ko'rinishiga o'tkazish (cheksiz daraja)
function buildTree(categories: any[], parentId: string | null = null): any[] {
  return categories
    .filter((c) => c.parentId === parentId)
    .map((c) => ({
      ...c,
      children: buildTree(categories, c.id),
    }));
}

export const categoryController = new Elysia({ prefix: "/api/categories" })

  // GET /api/categories — cheksiz darajali daraxt
  .get(
    "/",
    async () => {
      const all = await prisma.category.findMany({
        orderBy: { createdAt: "asc" },
      });

      const tree = buildTree(all);

      return { data: tree };
    },
    {
      tags: ["Categories"],
      detail: { summary: "Barcha kategoriyalar daraxt ko'rinishida (cheksiz daraja) — name: { uz, ru, en }" },
    }
  )

  // GET /api/categories/:id
  .get(
    "/:id",
    async ({ params }) => {
      const category = await prisma.category.findUnique({
        where: { id: params.id },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          products: {
            where: { product: { isActive: true } },
            include: {
              product: {
                include: { images: true, discount: true },
              },
            },
            take: 20,
          },
        },
      });
      if (!category) throw new AppError(404, "Kategoriya topilmadi!");

      // Bu categoryning barcha children (cheksiz daraja)
      const all = await prisma.category.findMany({
        orderBy: { createdAt: "asc" },
      });
      const children = buildTree(all, params.id);

      return { data: { ...category, children } };
    },
    {
      tags: ["Categories"],
      detail: { summary: "ID bo'yicha kategoriya + cheksiz darajali children + productlari" },
      params: t.Object({ id: t.String() }),
    }
  );
