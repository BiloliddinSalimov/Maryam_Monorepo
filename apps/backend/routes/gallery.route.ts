import { Elysia } from "elysia";
import { adminGalleryController } from "../controllers/admin.gallery.controller";

export const galleryRoutes = new Elysia().use(adminGalleryController);
