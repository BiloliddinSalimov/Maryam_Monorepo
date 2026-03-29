import { Elysia } from "elysia";
import { adminHomepageController } from "../controllers/admin.homepage.controller";
import { homepageController } from "../controllers/homepage.controller";

export const homepageRoutes = new Elysia()
  .use(adminHomepageController)
  .use(homepageController);
