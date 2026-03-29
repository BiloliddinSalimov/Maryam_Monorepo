import { Elysia, t } from "elysia";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

const productInclude = {
  images: { orderBy: { isMain: "desc" as const } },
  discount: true,
  categories: {
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  },
};

function formatProduct(p: any) {
  return {
    ...p,
    categories: p.categories.map((c: any) => c.category),
  };
}

export const productController = new Elysia({ prefix: "/api/products" })

  // GET /api/products
  // name va description: { uz: "...", ru: "...", en: "..." } — frontend o'zi kerakli tilni oladi
  .get(
    "/",
    async ({ query }) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 20;
      const skip = (page - 1) * limit;
      const categoryId = query.categoryId?.trim() || undefined;
      const search = query.search ?? undefined;

      const where: any = {
        isActive: true,
        ...(categoryId
          ? { categories: { some: { categoryId } } }
          : {}),
        ...(search
          ? {
              OR: [
                { name: { path: ["uz"], string_contains: search } },
                { name: { path: ["ru"], string_contains: search } },
                { name: { path: ["en"], string_contains: search } },
                { description: { path: ["uz"], string_contains: search } },
                { description: { path: ["ru"], string_contains: search } },
              ],
            }
          : {}),
      };

      const [total, products] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          include: productInclude,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        data: products.map(formatProduct),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },
    {
      tags: ["Products"],
      detail: { summary: "Barcha mahsulotlar — name/description: { uz, ru, en }" },
      query: t.Object({
        page: t.Optional(t.String({ description: "Sahifa raqami (default: 1)" })),
        limit: t.Optional(t.String({ description: "Sahifadagi elementlar (default: 20)" })),
        categoryId: t.Optional(t.String({ description: "Kategoriya UUID si bo'yicha filter" })),
        search: t.Optional(t.String({ description: "Qidiruv so'zi (barcha tillarda)" })),
      }),
    }
  )

  // GET /api/products/:id
  .get(
    "/:id",
    async ({ params }) => {
      const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: productInclude,
      });
      if (!product) throw new AppError(404, "Mahsulot topilmadi!");
      return { data: formatProduct(product) };
    },
    {
      tags: ["Products"],
      detail: { summary: "ID bo'yicha bitta mahsulot — name/description: { uz, ru, en }" },
      params: t.Object({ id: t.String() }),
    }
  );
