import Elysia from "elysia";
import { categoryController } from "../controllers/category.controller";
import { adminCategoryController } from "../controllers/admin.category.controller";

export const categoryRoutes = new Elysia()
  .use(categoryController)
  .use(adminCategoryController);
