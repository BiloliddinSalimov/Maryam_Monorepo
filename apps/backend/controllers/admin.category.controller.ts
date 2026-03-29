import { Elysia, t } from "elysia";
import { adminMiddleware } from "../middlewares/admin";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";
import { Timer } from "../lib/timer";

function extractText(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, string>;
    return obj.uz || obj.ru || obj.en || Object.values(obj)[0] || "";
  }
  return "";
}

function buildTree(categories: any[], parentId: string | null = null): any[] {
  return categories
    .filter((c) => c.parentId === parentId)
    .map((c) => ({
      ...c,
      children: buildTree(categories, c.id),
    }));
}

const categoryInclude = {
  parent: { select: { id: true, name: true, slug: true } },
  products: {
    include: {
      product: { select: { id: true, name: true, slug: true, price: true, isActive: true } },
    },
  },
};

export const adminCategoryController = new Elysia({
  prefix: "/admin/categories",
  tags: ["Admin Categories"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(adminMiddleware)

  // POST /admin/categories — kategoriya qo'shish (ixtiyoriy productIds)
  .post(
    "/",
    async ({ body }) => {
      const timer = new Timer("POST /admin/categories");

      const nameText = extractText(body.name);
      const rawSlug =
        body.slug?.trim() ||
        nameText
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      const slug = rawSlug || "category-" + Date.now();

      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) throw new AppError(409, `"${slug}" slug allaqachon mavjud!`);

      if (body.parentId?.trim()) {
        const parent = await prisma.category.findUnique({ where: { id: body.parentId.trim() } });
        if (!parent) throw new AppError(404, "Parent kategoriya topilmadi!");
      }

      if (body.productIds && body.productIds.length > 0) {
        const found = await prisma.product.count({
          where: { id: { in: body.productIds } },
        });
        if (found !== body.productIds.length)
          throw new AppError(404, "Bir yoki bir nechta mahsulot topilmadi!");
      }
      timer.step("validation");

      const category = await prisma.category.create({
        data: {
          name: body.name,
          slug,
          image: body.image?.trim() || null,
          parentId: body.parentId?.trim() || null,
          products:
            body.productIds && body.productIds.length > 0
              ? {
                  create: body.productIds.map((productId) => ({ productId })),
                }
              : undefined,
        },
        include: categoryInclude,
      });
      timer.step("create");

      const allCategories = await prisma.category.findMany({ orderBy: { createdAt: "asc" } });
      const children = buildTree(allCategories, category.id);
      timer.step("buildTree");
      timer.done();

      return { data: { ...category, children } };
    },
    {
      body: t.Object({
        name: t.Any({
          description: 'Kategoriya nomi — { "uz": "Elektronika", "ru": "Электроника", "en": "Electronics" }',
        }),
        slug: t.Optional(t.String({ description: "URL slug (bo'sh qolsa avtomatik)" })),
        image: t.Optional(t.String({ description: "Rasm URL" })),
        parentId: t.Optional(t.String({ description: "Parent kategoriya UUID si" })),
        productIds: t.Optional(t.Array(t.String(), { description: "Biriktiriladigan mahsulot UUID lari (ixtiyoriy)" })),
      }),
    }
  )

  // PUT /admin/categories/:id — kategoriyani yangilash
  .put(
    "/:id",
    async ({ params, body }) => {
      const timer = new Timer(`PUT /admin/categories/${params.id}`);

      const category = await prisma.category.findUnique({ where: { id: params.id } });
      if (!category) throw new AppError(404, "Kategoriya topilmadi!");

      if (body.slug && body.slug !== category.slug) {
        const existing = await prisma.category.findUnique({ where: { slug: body.slug } });
        if (existing) throw new AppError(409, "Bu slug allaqachon mavjud!");
      }

      if (body.parentId && body.parentId.trim()) {
        const newParentId = body.parentId.trim();

        if (newParentId === params.id)
          throw new AppError(400, "Kategoriya o'ziga o'zi parent bo'la olmaydi!");

        let currentId: string | null = newParentId;
        while (currentId) {
          if (currentId === params.id)
            throw new AppError(400, "Circular reference: bu kategoriya yangi parent ning avlodi hisoblanadi!");
          const current = await prisma.category.findUnique({
            where: { id: currentId },
            select: { parentId: true },
          });
          currentId = current?.parentId ?? null;
        }
      }
      timer.step("validation");

      const updated = await prisma.category.update({
        where: { id: params.id },
        data: {
          ...(body.name !== undefined ? { name: body.name } : {}),
          slug: body.slug ?? category.slug,
          image: body.image !== undefined ? body.image : category.image,
          parentId:
            body.parentId !== undefined
              ? (body.parentId?.trim() || null)
              : category.parentId,
        },
        include: categoryInclude,
      });
      timer.step("update");

      const allCategories = await prisma.category.findMany({ orderBy: { createdAt: "asc" } });
      const children = buildTree(allCategories, params.id);
      timer.step("buildTree");
      timer.done();

      return { data: { ...updated, children } };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(
          t.Any({ description: '{ "uz": "...", "ru": "...", "en": "..." }' })
        ),
        slug: t.Optional(t.String()),
        image: t.Optional(t.Nullable(t.String())),
        parentId: t.Optional(t.Nullable(t.String())),
      }),
    }
  )

  // POST /admin/categories/:id/products — mahsulotlar biriktirish
  .post(
    "/:id/products",
    async ({ params, body }) => {
      const timer = new Timer(`POST /admin/categories/${params.id}/products`);

      const category = await prisma.category.findUnique({ where: { id: params.id } });
      if (!category) throw new AppError(404, "Kategoriya topilmadi!");

      const found = await prisma.product.count({
        where: { id: { in: body.productIds } },
      });
      if (found !== body.productIds.length)
        throw new AppError(404, "Bir yoki bir nechta mahsulot topilmadi!");
      timer.step("validation");

      await prisma.productCategory.createMany({
        data: body.productIds.map((productId) => ({
          productId,
          categoryId: params.id,
        })),
        skipDuplicates: true,
      });
      timer.step("createMany");

      const updated = await prisma.category.findUnique({
        where: { id: params.id },
        include: categoryInclude,
      });
      timer.step("fetch+include");
      timer.done();

      return { data: updated };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        productIds: t.Array(t.String(), { minItems: 1, description: "Biriktiriladigan mahsulot UUID lari" }),
      }),
    }
  )

  // DELETE /admin/categories/:id/products — mahsulotlardan uzish
  .delete(
    "/:id/products",
    async ({ params, body }) => {
      const timer = new Timer(`DELETE /admin/categories/${params.id}/products`);

      const category = await prisma.category.findUnique({ where: { id: params.id } });
      if (!category) throw new AppError(404, "Kategoriya topilmadi!");
      timer.step("validation");

      await prisma.productCategory.deleteMany({
        where: {
          categoryId: params.id,
          productId: { in: body.productIds },
        },
      });
      timer.step("deleteMany");

      const updated = await prisma.category.findUnique({
        where: { id: params.id },
        include: categoryInclude,
      });
      timer.step("fetch+include");
      timer.done();

      return { data: updated };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        productIds: t.Array(t.String(), { minItems: 1, description: "Uziladigan mahsulot UUID lari" }),
      }),
    }
  )

  // DELETE /admin/categories/:id — kategoriyani o'chirish
  .delete(
    "/:id",
    async ({ params }) => {
      const timer = new Timer(`DELETE /admin/categories/${params.id}`);

      const category = await prisma.category.findUnique({
        where: { id: params.id },
        include: { children: true },
      });
      if (!category) throw new AppError(404, "Kategoriya topilmadi!");

      if (category.children.length > 0)
        throw new AppError(400, "Bu kategoriyada child kategoriyalar bor, avval ularni o'chiring!");
      timer.step("validation");

      await prisma.category.delete({ where: { id: params.id } });
      timer.step("delete");
      timer.done();

      return { message: "Kategoriya muvaffaqiyatli o'chirildi!" };
    },
    { params: t.Object({ id: t.String() }) }
  );
