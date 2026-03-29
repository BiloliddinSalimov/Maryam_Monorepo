import Elysia from "elysia";
import { bannerController } from "../controllers/banner.controller";
import { adminBannerController } from "../controllers/admin.banner.controller";

export const bannerRoutes = new Elysia()
  .use(bannerController)
  .use(adminBannerController);
