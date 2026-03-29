import Elysia from "elysia";
import { orderController } from "../controllers/order.controller";
import { adminOrderController } from "../controllers/admin.order.controller";

export const orderRoutes = new Elysia()
  .use(orderController)
  .use(adminOrderController);
