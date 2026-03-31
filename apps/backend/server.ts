import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Prisma } from "@prisma/client";
import { join } from "path";
import { existsSync } from "fs";
import { AppError } from "./lib/errors";

// Routes
import { authRoutes } from "./routes/auth.route";
import { userRoutes } from "./routes/user.route";
import { productRoutes } from "./routes/product.route";
import { categoryRoutes } from "./routes/category.route";
import { basketRoutes } from "./routes/basket.route";
import { wishlistRoutes } from "./routes/wishlist.route";
import { orderRoutes } from "./routes/order.route";
import { bannerRoutes } from "./routes/banner.route";
import { uploadRoutes } from "./routes/upload.route";
import { homepageRoutes } from "./routes/homepage.route";
import { languageRoutes } from "./routes/language.route";
import { galleryRoutes } from "./routes/gallery.route";

const app = new Elysia()
  .use(cors())

  // ─── Upload test sahifasi ─────────────────────────────────────────────────
  .get(
    "/upload-ui",
    () =>
      new Response(
        `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Rasm Yuklash</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; background: #0f172a; color: #e2e8f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #1e293b; border-radius: 12px; padding: 32px; width: 480px; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
    h2 { margin-bottom: 24px; font-size: 20px; color: #7dd3fc; }
    label { display: block; font-size: 13px; margin-bottom: 6px; color: #94a3b8; }
    input { width: 100%; padding: 10px 14px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #e2e8f0; font-size: 14px; margin-bottom: 16px; }
    input[type=file] { cursor: pointer; }
    button { width: 100%; padding: 12px; background: #0ea5e9; color: white; border: none; border-radius: 8px; font-size: 15px; cursor: pointer; font-weight: 600; }
    button:hover { background: #0284c7; }
    #result { margin-top: 20px; padding: 14px; background: #0f172a; border-radius: 8px; font-size: 13px; display: none; }
    #result.success { border-left: 3px solid #22c55e; }
    #result.error { border-left: 3px solid #ef4444; }
    .url-box { margin-top: 10px; padding: 8px 12px; background: #1e293b; border-radius: 6px; word-break: break-all; color: #7dd3fc; cursor: pointer; font-size: 13px; }
    .url-box:hover { background: #334155; }
    small { color: #64748b; font-size: 11px; display: block; margin-top: 4px; }
    .preview { margin-top: 12px; max-width: 100%; border-radius: 8px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🖼️ Rasm Yuklash</h2>
    <label>Admin Token (Bearer ...)</label>
    <input type="text" id="token" placeholder="eyJhbGciOiJIUzI1NiJ9..." />
    <label>Rasm tanlang</label>
    <input type="file" id="file" accept="image/*" onchange="preview()" />
    <img id="img-preview" class="preview" />
    <button onclick="upload()">⬆️ Yuklash</button>
    <div id="result"></div>
  </div>
  <script>
    function preview() {
      const f = document.getElementById('file').files[0];
      if (!f) return;
      const img = document.getElementById('img-preview');
      img.src = URL.createObjectURL(f);
      img.style.display = 'block';
    }
    async function upload() {
      const token = document.getElementById('token').value.trim();
      const file = document.getElementById('file').files[0];
      const result = document.getElementById('result');
      if (!token) { result.className='error'; result.style.display='block'; result.innerHTML='❌ Token kiriting!'; return; }
      if (!file) { result.className='error'; result.style.display='block'; result.innerHTML='❌ Fayl tanlang!'; return; }
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch('/admin/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: fd });
        const data = await res.json();
        if (res.ok) {
          result.className='success'; result.style.display='block';
          result.innerHTML = '✅ Yuklandi!<div class="url-box" onclick="copy(this)" title="Nusxalash uchun bosing">' + data.url + '</div><small>👆 URL ni nusxalash uchun bosing</small>';
        } else {
          result.className='error'; result.style.display='block'; result.innerHTML='❌ ' + (data.message || 'Xato');
        }
      } catch(e) { result.className='error'; result.style.display='block'; result.innerHTML='❌ ' + e.message; }
    }
    function copy(el) {
      navigator.clipboard.writeText(el.innerText);
      el.title='Nusxalandi!';
      el.style.color='#22c55e';
      setTimeout(() => { el.style.color='#7dd3fc'; }, 1500);
    }
  </script>
</body>
</html>`,
        { headers: { "Content-Type": "text/html" } },
      ),
  )

  // ─── Static files — yuklangan rasmlarni serve qilish ─────────────────────
  .get("/uploads/:filename", ({ params }) => {
    const filePath = join(process.cwd(), "public", "uploads", params.filename);
    if (!existsSync(filePath)) {
      return new Response(JSON.stringify({ message: "Rasm topilmadi!" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return Bun.file(filePath);
  })

  // ─── Swagger UI ────────────────────────────────────────────────────────────
  .use(
    swagger({
      path: "/docs",
      provider: "swagger-ui",
      documentation: {
        info: {
          title: "Ecommerce API",
          version: "1.0.0",
          description:
            "Elysia.js + Bun + Prisma 5 + SQLite bilan qurilgan Ecommerce backend API",
        },
        tags: [
          { name: "Auth", description: "Autentifikatsiya endpointlari" },
          { name: "Admin Auth", description: "Admin login" },
          { name: "Admin Upload", description: "Rasm yuklash" },
          { name: "User", description: "Foydalanuvchi profili" },
          {
            name: "Products",
            description: "Mahsulotlar (barcha foydalanuvchilar)",
          },
          {
            name: "Admin Products",
            description: "Mahsulotlar boshqaruvi (admin)",
          },
          {
            name: "Categories",
            description: "Kategoriyalar (barcha foydalanuvchilar)",
          },
          {
            name: "Admin Categories",
            description: "Kategoriyalar boshqaruvi (admin)",
          },
          { name: "Basket", description: "Savat — JWT talab qiladi" },
          { name: "Wishlist", description: "Sevimlilar — JWT talab qiladi" },
          { name: "Orders", description: "Buyurtmalar — JWT talab qiladi" },
          {
            name: "Admin Orders",
            description: "Buyurtmalar boshqaruvi (admin)",
          },
          { name: "Banners", description: "Bannerlar" },
          {
            name: "Admin Banners",
            description: "Bannerlar boshqaruvi (admin)",
          },
          { name: "Homepage", description: "Bosh sahifa (public)" },
          {
            name: "Admin Homepage",
            description: "Bosh sahifa section boshqaruvi (admin)",
          },
          {
            name: "Admin Languages",
            description: "Til va tarjimalar boshqaruvi (admin)",
          },
          {
            name: "Admin Gallery",
            description: "Rasm galereyasi boshqaruvi (admin)",
          },
        ],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    }),
  )

  // ─── Error handler ─────────────────────────────────────────────────────────
  .onError(({ error, code }) => {
    const json = (body: object, status: number) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      });

    if (code === "NOT_FOUND") {
      return json({ message: "Bu yo'l mavjud emas!" }, 404);
    }
    if (code === "VALIDATION") {
      return json(
        { message: "Ma'lumotlar noto'g'ri!", detail: error.message },
        422,
      );
    }
    if (code === "PARSE") {
      return json(
        {
          message:
            "JSON formati noto'g'ri! Vergul yoki tirnoq xatosini tekshiring.",
        },
        400,
      );
    }
    if (error instanceof AppError) {
      return json({ message: error.message }, error.statusCode);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const field = (error.meta?.target as string[])?.join(", ") ?? "maydon";
        return json({ message: `Bu ${field} allaqachon mavjud!` }, 409);
      }
      if (error.code === "P2003") {
        return json({ message: "Bog'liq yozuv topilmadi!" }, 400);
      }
      if (error.code === "P2025") {
        return json({ message: "Yozuv topilmadi!" }, 404);
      }
      return json({ message: `DB xatosi: ${error.message}` }, 400);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      return json(
        {
          message: "DB ga noto'g'ri ma'lumot yuborildi!",
          detail: error.message,
        },
        400,
      );
    }

    console.error("❌ Server xatosi:", error);
    return json(
      { message: "Ichki server xatosi!", detail: String(error) },
      500,
    );
  })

  // ─── Routes ───────────────────────────────────────────────────────────────
  .use(uploadRoutes)
  .use(authRoutes)
  .use(userRoutes)
  .use(productRoutes)
  .use(categoryRoutes)
  .use(basketRoutes)
  .use(wishlistRoutes)
  .use(orderRoutes)
  .use(bannerRoutes)
  .use(homepageRoutes)
  .use(languageRoutes)
  .use(galleryRoutes)

  // ─── Health check ─────────────────────────────────────────────────────────
  .get("/", () => ({
    message: "Ecommerce Backend ishlayapti! 🚀",
    status: "ok",
    version: "1.0.0",
    docs: "http://localhost:5000/docs",
  }))

  .listen(5000);

console.log(`🚀 Server    : http://localhost:${app.server?.port}`);
console.log(`📖 Swagger   : http://localhost:${app.server?.port}/docs`);
console.log(`🖼️  Uploads   : http://localhost:${app.server?.port}/uploads/`);

export type App = typeof app;
