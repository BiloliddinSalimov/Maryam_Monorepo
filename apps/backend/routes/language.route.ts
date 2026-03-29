import Elysia from "elysia";
import { adminLanguageController } from "../controllers/admin.language.controller";

export const languageRoutes = new Elysia().use(adminLanguageController);
