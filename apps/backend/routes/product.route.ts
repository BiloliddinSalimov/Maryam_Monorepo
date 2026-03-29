import Elysia from "elysia";
import { productController } from "../controllers/product.controller";
import { adminProductController } from "../controllers/admin.product.controller";

export const productRoutes = new Elysia()
  .use(productController)
  .use(adminProductController);
