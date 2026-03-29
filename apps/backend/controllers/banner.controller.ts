import { Elysia } from "elysia";
import prisma from "../lib/prisma";

export const bannerController = new Elysia({ prefix: "/api/banners" })

  // GET /api/banners
  // title: { uz: "...", ru: "...", en: "..." } — frontend o'zi kerakli tilni oladi
  .get(
    "/",
    async () => {
      const banners = await prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });

      return { data: banners };
    },
    {
      tags: ["Banners"],
      detail: { summary: "Aktiv bannerlar — title: { uz, ru, en }" },
    },
  );
