import { Elysia, t } from "elysia";
import { adminMiddleware } from "../middlewares/admin";
import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";
import { Timer } from "../lib/timer";
import { mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

await mkdir(UPLOAD_DIR, { recursive: true });

export const adminGalleryController = new Elysia({
  prefix: "/admin/gallery",
  tags: ["Admin Gallery"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(adminMiddleware)

  // GET /admin/gallery — barcha rasmlar ro'yxati (pagination bilan)
  .get(
    "/",
    async ({ query }) => {
      const timer = new Timer("GET /admin/gallery");

      const page = Math.max(1, query.page ?? 1);
      const limit = Math.min(100, Math.max(1, query.limit ?? 20));
      const skip = (page - 1) * limit;

      const [images, total] = await Promise.all([
        prisma.galleryImage.findMany({
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.galleryImage.count(),
      ]);
      timer.step("findMany+count");
      timer.done();

      return {
        data: images.map((img) => ({
          ...img,
          fullUrl: `${BASE_URL}${img.url}`,
        })),
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
        page: t.Optional(t.Numeric({ minimum: 1 })),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      }),
      detail: { summary: "Gallery rasmlar ro'yxati" },
    },
  )

  // GET /admin/gallery/:id — bitta rasm ma'lumoti
  .get(
    "/:id",
    async ({ params }) => {
      const timer = new Timer(`GET /admin/gallery/${params.id}`);

      const image = await prisma.galleryImage.findUnique({
        where: { id: params.id },
      });
      if (!image) throw new AppError(404, "Rasm topilmadi!");
      timer.step("findUnique");
      timer.done();

      return { ...image, fullUrl: `${BASE_URL}${image.url}` };
    },
    {
      detail: { summary: "Bitta gallery rasmini olish" },
    },
  )

  // POST /admin/gallery — yangi rasm yuklash
  .post(
    "/",
    async ({ body }) => {
      const timer = new Timer("POST /admin/gallery");

      const file = body.file;

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new AppError(400, "Faqat rasm fayllari qabul qilinadi (jpg, png, webp, gif)!");
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new AppError(400, "Fayl hajmi 5MB dan oshmasligi kerak!");
      }
      timer.step("validation");

      const ext = file.name.split(".").pop() ?? "jpg";
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = join(UPLOAD_DIR, fileName);

      await Bun.write(filePath, file);
      timer.step("disk-write");

      const url = `/uploads/${fileName}`;
      const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

      const image = await prisma.galleryImage.create({
        data: {
          url,
          name: fileName,
          size: file.size,
          type: file.type,
        },
      });
      timer.step("db-create");
      timer.done();

      return {
        ...image,
        fullUrl: `${baseUrl}${url}`,
      };
    },
    {
      type: "formdata",
      body: t.Object({
        file: t.File(),
      }),
      detail: {
        summary: "Galleryga rasm yuklash",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "Rasm (jpg, png, webp, gif) — max 5MB",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
      },
    },
  )

  // DELETE /admin/gallery/:id — rasmni o'chirish (diskdan ham, DBdan ham)
  .delete(
    "/:id",
    async ({ params }) => {
      const timer = new Timer(`DELETE /admin/gallery/${params.id}`);

      const image = await prisma.galleryImage.findUnique({
        where: { id: params.id },
      });
      if (!image) throw new AppError(404, "Rasm topilmadi!");
      timer.step("validation");

      const fileName = image.url.replace("/uploads/", "");
      const filePath = join(UPLOAD_DIR, fileName);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
      timer.step("disk-delete");

      await prisma.galleryImage.delete({ where: { id: params.id } });
      timer.step("db-delete");
      timer.done();

      return { message: "Rasm o'chirildi!" };
    },
    {
      detail: { summary: "Rasmni gallerydan o'chirish" },
    },
  );
