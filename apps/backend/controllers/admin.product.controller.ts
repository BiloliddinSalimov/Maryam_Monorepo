import { Elysia, t } from "elysia";
import { adminMiddleware } from "../middlewares/admin";
import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";
import { Timer } from "../lib/timer";

// name yoki description JSON obyektidan birinchi matnni olish (slug uchun)
function extractText(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, string>;
    return obj.uz || obj.ru || obj.en || Object.values(obj)[0] || "";
  }
  return "";
}

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

export const adminProductController = new Elysia({
  prefix: "/admin/products",
  tags: ["Admin Products"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(adminMiddleware)

  // POST /admin/products — mahsulot qo'shish (category majburiy emas)
  .post(
    "/",
    async ({ body }) => {
      const timer = new Timer("POST /admin/products");
      const nameText = extractText(body.name);
      const rawSlug =
        body.slug?.trim() ||
        nameText
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      const slug = rawSlug || "product-" + Date.now();

      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) throw new AppError(409, "Bu slug allaqachon mavjud!");

      if (body.categoryIds && body.categoryIds.length > 0) {
        const found = await prisma.category.count({
          where: { id: { in: body.categoryIds } },
        });
        if (found !== body.categoryIds.length)
          throw new AppError(404, "Bir yoki bir nechta kategoriya topilmadi!");
      }
      timer.step("validation");

      const product = await prisma.product.create({
        data: {
          name: body.name,
          slug,
          description: body.description ?? null,
          price: body.price,
          stock: body.stock ?? 0,
          categories:
            body.categoryIds && body.categoryIds.length > 0
              ? {
                  create: body.categoryIds.map((categoryId) => ({
                    categoryId,
                  })),
                }
              : undefined,
          images: body.images
            ? {
                create: body.images.map((url, i) => ({
                  url,
                  isMain: i === 0,
                })),
              }
            : undefined,
          discount:
            body.discount &&
            body.discount.percent > 0 &&
            body.discount.startDate &&
            body.discount.endDate
              ? {
                  create: {
                    percent: body.discount.percent,
                    startDate: new Date(body.discount.startDate),
                    endDate: new Date(body.discount.endDate),
                  },
                }
              : undefined,
        },
        include: productInclude,
      });
      timer.step("create");
      timer.done();

      return { data: formatProduct(product) };
    },
    {
      body: t.Object({
        name: t.Any({
          description:
            'Mahsulot nomi — { "uz": "Nomi", "ru": "Название", "en": "Name" }',
          examples: [{ uz: "iPhone 15", ru: "Айфон 15", en: "iPhone 15" }],
        }),
        slug: t.Optional(t.String()),
        description: t.Optional(
          t.Any({
            description: 'Tavsif — { "uz": "...", "ru": "...", "en": "..." }',
          }),
        ),
        price: t.Number({ minimum: 0 }),
        stock: t.Optional(t.Number({ minimum: 0 })),
        categoryIds: t.Optional(
          t.Array(t.String(), {
            description: "Kategoriya UUID lari (ixtiyoriy)",
          }),
        ),
        images: t.Optional(t.Array(t.String())),
        discount: t.Optional(
          t.Object({
            percent: t.Number({ minimum: 0, maximum: 100 }),
            startDate: t.String(),
            endDate: t.String(),
          }),
        ),
      }),
    },
  )

  // PUT /admin/products/:id — mahsulotni yangilash
  .put(
    "/:id",
    async ({ params, body }) => {
      const timer = new Timer(`PUT /admin/products/${params.id}`);

      const product = await prisma.product.findUnique({
        where: { id: params.id },
      });
      if (!product) throw new AppError(404, "Mahsulot topilmadi!");

      if (body.slug && body.slug !== product.slug) {
        const existing = await prisma.product.findUnique({
          where: { slug: body.slug },
        });
        if (existing) throw new AppError(409, "Bu slug allaqachon mavjud!");
      }
      timer.step("validation");

      await prisma.product.update({
        where: { id: params.id },
        data: {
          ...(body.name !== undefined ? { name: body.name } : {}),
          ...(body.slug !== undefined ? { slug: body.slug } : {}),
          ...(body.description !== undefined
            ? { description: body.description }
            : {}),
          ...(body.price !== undefined ? { price: body.price } : {}),
          ...(body.stock !== undefined ? { stock: body.stock } : {}),
          ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        },
      });
      timer.step("update");

      const updated = await prisma.product.findUnique({
        where: { id: params.id },
        include: productInclude,
      });
      timer.step("fetch+include");
      timer.done();

      return { data: formatProduct(updated!) };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(
          t.Any({ description: '{ "uz": "...", "ru": "...", "en": "..." }' }),
        ),
        slug: t.Optional(t.String()),
        description: t.Optional(
          t.Nullable(
            t.Any({ description: '{ "uz": "...", "ru": "...", "en": "..." }' }),
          ),
        ),
        price: t.Optional(t.Number({ minimum: 0 })),
        stock: t.Optional(t.Number({ minimum: 0 })),
        isActive: t.Optional(t.Boolean()),
        images: t.Optional(t.Array(t.String())),
        discount: t.Optional(
          t.Nullable(
            t.Object({
              percent: t.Number({ minimum: 1, maximum: 100 }),
              startDate: t.String(),
              endDate: t.String(),
            }),
          ),
        ),
      }),
    },
  )

  // POST /admin/products/:id/categories — categoriyalar biriktirish
  .post(
    "/:id/categories",
    async ({ params, body }) => {
      const timer = new Timer(`POST /admin/products/${params.id}/categories`);

      const product = await prisma.product.findUnique({
        where: { id: params.id },
      });
      if (!product) throw new AppError(404, "Mahsulot topilmadi!");

      const found = await prisma.category.count({
        where: { id: { in: body.categoryIds } },
      });
      if (found !== body.categoryIds.length)
        throw new AppError(404, "Bir yoki bir nechta kategoriya topilmadi!");
      timer.step("validation");

      await prisma.productCategory.createMany({
        data: body.categoryIds.map((categoryId) => ({
          productId: params.id,
          categoryId,
        })),
        skipDuplicates: true,
      });
      timer.step("createMany");

      const updated = await prisma.product.findUnique({
        where: { id: params.id },
        include: productInclude,
      });
      timer.step("fetch+include");
      timer.done();

      return { data: formatProduct(updated!) };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        categoryIds: t.Array(t.String(), {
          minItems: 1,
          description: "Biriktiriladigan kategoriya UUID lari",
        }),
      }),
    },
  )

  // DELETE /admin/products/:id/categories — categoriyalardan uzish
  .delete(
    "/:id/categories",
    async ({ params, body }) => {
      const timer = new Timer(`DELETE /admin/products/${params.id}/categories`);

      const product = await prisma.product.findUnique({
        where: { id: params.id },
      });
      if (!product) throw new AppError(404, "Mahsulot topilmadi!");
      timer.step("validation");

      await prisma.productCategory.deleteMany({
        where: {
          productId: params.id,
          categoryId: { in: body.categoryIds },
        },
      });
      timer.step("deleteMany");

      const updated = await prisma.product.findUnique({
        where: { id: params.id },
        include: productInclude,
      });
      timer.step("fetch+include");
      timer.done();

      return { data: formatProduct(updated!) };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        categoryIds: t.Array(t.String(), {
          minItems: 1,
          description: "Uziladigan kategoriya UUID lari",
        }),
      }),
    },
  )

  // POST /admin/products/:id/images — rasm qo'shish
  .post(
    "/:id/images",
    async ({ params, body }) => {
      const timer = new Timer(`POST /admin/products/${params.id}/images`);

      const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: { images: true },
      });
      if (!product) throw new AppError(404, "Mahsulot topilmadi!");
      const hasMain = product.images.some((img) => img.isMain);
      timer.step("validation");

      await prisma.productImage.createMany({
        data: body.urls.map((url, i) => ({
          url,
          productId: params.id,
          isMain: !hasMain && i === 0,
        })),
      });
      timer.step("createMany");

      const updated = await prisma.product.findUnique({
        where: { id: params.id },
        include: productInclude,
      });
      timer.step("fetch+include");
      timer.done();

      return { data: formatProduct(updated!) };
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        urls: t.Array(t.String({ minLength: 1 }), {
          minItems: 1,
          description: "Rasm URL lari",
        }),
      }),
    },
  )

  // DELETE /admin/products/:id/images/:imgId — bitta rasmni o'chirish
  .delete(
    "/:id/images/:imgId",
    async ({ params }) => {
      const timer = new Timer(`DELETE /admin/products/${params.id}/images/${params.imgId}`);

      const image = await prisma.productImage.findFirst({
        where: { id: params.imgId, productId: params.id },
      });
      if (!image) throw new AppError(404, "Rasm topilmadi!");
      timer.step("validation");

      await prisma.productImage.delete({ where: { id: params.imgId } });
      if (image.isMain) {
        const next = await prisma.productImage.findFirst({
          where: { productId: params.id },
          orderBy: { createdAt: "asc" },
        });
        if (next)
          await prisma.productImage.update({
            where: { id: next.id },
            data: { isMain: true },
          });
      }
      timer.step("delete+promote");

      const updated = await prisma.product.findUnique({
        where: { id: params.id },
        include: productInclude,
      });
      timer.step("fetch+include");
      timer.done();

      return { data: formatProduct(updated!) };
    },
    { params: t.Object({ id: t.String(), imgId: t.String() }) },
  )

  // PATCH /admin/products/:id/images/:imgId/main — asosiy rasm qilish
  .patch(
    "/:id/images/:imgId/main",
    async ({ params }) => {
      const timer = new Timer(`PATCH /admin/products/${params.id}/images/${params.imgId}/main`);

      const image = await prisma.productImage.findFirst({
        where: { id: params.imgId, productId: params.id },
      });
      if (!image) throw new AppError(404, "Rasm topilmadi!");
      timer.step("validation");

      await prisma.$transaction([
        prisma.productImage.updateMany({
          where: { productId: params.id },
          data: { isMain: false },
        }),
        prisma.productImage.update({
          where: { id: params.imgId },
          data: { isMain: true },
        }),
      ]);
      timer.step("transaction");

      const updated = await prisma.product.findUnique({
        where: { id: params.id },
        include: productInclude,
      });
      timer.step("fetch+include");
      timer.done();

      return { data: formatProduct(updated!) };
    },
    { params: t.Object({ id: t.String(), imgId: t.String() }) },
  )

  // DELETE /admin/products/:id — mahsulotni o'chirish
  .delete(
    "/:id",
    async ({ params }) => {
      const product = await prisma.product.findUnique({
        where: { id: params.id },
      });
      if (!product) throw new AppError(404, "Mahsulot topilmadi!");

      await prisma.product.delete({ where: { id: params.id } });

      return { message: "Mahsulot muvaffaqiyatli o'chirildi!" };
    },
    { params: t.Object({ id: t.String() }) },
  );
