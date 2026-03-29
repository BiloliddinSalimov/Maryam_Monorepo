import Elysia from "elysia";
import { uploadController } from "../controllers/upload.controller";

export const uploadRoutes = new Elysia().use(uploadController);
