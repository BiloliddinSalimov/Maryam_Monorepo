import { Elysia, t } from "elysia";
import { adminMiddleware } from "../middlewares/admin";
import { AppError } from "../lib/errors";
import { mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

// uploads papkasini yaratish (mavjud bo'lmasa)
await mkdir(UPLOAD_DIR, { recursive: true });

export const uploadController = new Elysia({
  prefix: "/admin/upload",
  tags: ["Admin Upload"],
  detail: { security: [{ BearerAuth: [] }] },
})
  .use(adminMiddleware)

  // POST /admin/upload — rasm yuklash
  .post(
    "/",
    async ({ body }) => {
      const file = body.file;

      // Fayl turini tekshirish
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        throw new AppError(400, "Faqat rasm fayllari qabul qilinadi (jpg, png, webp, gif)!");
      }

      // Hajmni tekshirish (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new AppError(400, "Fayl hajmi 5MB dan oshmasligi kerak!");
      }

      // Noyob fayl nomi
      const ext = file.name.split(".").pop() ?? "jpg";
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = join(UPLOAD_DIR, fileName);

      // Faylni saqlash
      await Bun.write(filePath, file);

      const url = `/uploads/${fileName}`;

      return {
        url,
        fullUrl: `http://localhost:${process.env.PORT || 3000}${url}`,
        name: fileName,
        size: file.size,
        type: file.type,
      };
    },
    {
      type: "formdata",
      body: t.Object({
        file: t.File(),
      }),
      detail: {
        summary: "Bitta rasm yuklash",
        description: "Rasm yuklang va URL ni oling.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: { type: "string", format: "binary", description: "Rasm (jpg, png, webp, gif) — max 5MB" },
                },
                required: ["file"],
              },
            },
          },
        },
      },
    }
  )

  // POST /admin/upload/multiple — bir necha rasm
  .post(
    "/multiple",
    async ({ body }) => {
      const files = Array.isArray(body.files) ? body.files : [body.files];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      const maxSize = 5 * 1024 * 1024;
      const results = [];

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          throw new AppError(400, `"${file.name}" — faqat rasm fayllari qabul qilinadi!`);
        }
        if (file.size > maxSize) {
          throw new AppError(400, `"${file.name}" — hajmi 5MB dan oshmasligi kerak!`);
        }

        const ext = file.name.split(".").pop() ?? "jpg";
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const filePath = join(UPLOAD_DIR, fileName);
        await Bun.write(filePath, file);

        results.push({
          url: `/uploads/${fileName}`,
          fullUrl: `http://localhost:${process.env.PORT || 3000}/uploads/${fileName}`,
          name: fileName,
          size: file.size,
          type: file.type,
        });
      }

      return { files: results };
    },
    {
      type: "formdata",
      body: t.Object({
        files: t.Files(),
      }),
      detail: {
        summary: "Bir necha rasm yuklash",
        description: "Bir vaqtda bir necha rasm yuklash.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  files: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                    description: "Rasmlar (jpg, png, webp, gif) — har biri max 5MB",
                  },
                },
                required: ["files"],
              },
            },
          },
        },
      },
    }
  );
