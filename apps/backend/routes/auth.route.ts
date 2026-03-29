import { authController } from "../controllers/auth.controller";
import { adminAuthController } from "../controllers/admin.auth.controller";
import Elysia from "elysia";

export const authRoutes = new Elysia()
  .use(authController)
  .use(adminAuthController);
