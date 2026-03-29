import { z } from "zod";

export const bannerSchema = z.object({
  title: z.record(z.string(), z.string()),
  image: z.string().min(1, "Rasm majburiy"),
  link: z.string().optional(),
  isActive: z.boolean(),
  order: z.number().int().min(0),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
