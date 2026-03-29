import { Elysia } from "elysia";
import prisma from "../lib/prisma";

export const homepageController = new Elysia({
  prefix: "/api/homepage",
  tags: ["Homepage"],
})

  // ── GET /api/homepage ────────────────────────────────────────────────────
  // title, name, description: { uz: "...", ru: "...", en: "..." }
  .get("/", async () => {
    const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    type SectionRow = {
      id: string; type: string; title: unknown; order: number;
      isActive: boolean; config: string; createdAt: Date; updatedAt: Date;
    };

    const enriched = await Promise.all(
      sections.map(async (section: SectionRow) => {
        const config = parseConfig(section.config);
        const base = {
          id: section.id,
          type: section.type,
          title: section.title,
          order: section.order,
          config,
        };

        switch (section.type) {
          case "BANNER": {
            const cfg = config as { bannerIds?: string[] };
            let banners;

            if (cfg.bannerIds && cfg.bannerIds.length > 0) {
              banners = await prisma.banner.findMany({
                where: { id: { in: cfg.bannerIds }, isActive: true },
                orderBy: { order: "asc" },
              });
            } else {
              banners = await prisma.banner.findMany({
                where: { isActive: true },
                orderBy: { order: "asc" },
              });
            }

            return { ...base, banners };
          }

          case "PRODUCT_LIST": {
            const cfg = config as {
              productIds?: string[];
              limit?: number;
              sortBy?: string;
            };

            let products;

            if (cfg.productIds && cfg.productIds.length > 0) {
              products = await prisma.product.findMany({
                where: { id: { in: cfg.productIds }, isActive: true },
                include: {
                  images: { orderBy: { isMain: "desc" } },
                  category: { select: { id: true, name: true, slug: true } },
                  discount: true,
                },
                take: cfg.limit ?? 10,
              });

              const orderMap = new Map(cfg.productIds.map((id: string, i: number) => [id, i]));
              products.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
            } else {
              const orderBy: Record<string, "asc" | "desc"> =
                cfg.sortBy === "price_asc" ? { price: "asc" }
                : cfg.sortBy === "price_desc" ? { price: "desc" }
                : cfg.sortBy === "oldest" ? { createdAt: "asc" }
                : { createdAt: "desc" };

              products = await prisma.product.findMany({
                where: { isActive: true },
                include: {
                  images: { orderBy: { isMain: "desc" } },
                  category: { select: { id: true, name: true, slug: true } },
                  discount: true,
                },
                orderBy,
                take: cfg.limit ?? 10,
              });
            }

            return { ...base, products };
          }

          case "CATEGORY_LIST": {
            const cfg = config as {
              categoryIds?: string[];
              showAll?: boolean;
              limit?: number;
            };

            let categories;

            if (cfg.showAll) {
              categories = await prisma.category.findMany({
                where: { parentId: null },
                include: { children: { select: { id: true, name: true, slug: true } } },
                take: cfg.limit ?? 20,
              });
            } else if (cfg.categoryIds && cfg.categoryIds.length > 0) {
              categories = await prisma.category.findMany({
                where: { id: { in: cfg.categoryIds } },
                include: { children: { select: { id: true, name: true, slug: true } } },
              });

              const orderMap = new Map(cfg.categoryIds.map((id: string, i: number) => [id, i]));
              categories.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
            } else {
              categories = [];
            }

            return { ...base, categories };
          }

          case "PROMO_BLOCK":
            return { ...base };

          default:
            return { ...base };
        }
      })
    );

    return { data: enriched };
  });

function parseConfig(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
