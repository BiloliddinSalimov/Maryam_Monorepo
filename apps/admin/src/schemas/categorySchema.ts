import { z } from "zod";

export const categorySchema = z.object({
  name: z.record(z.string(), z.string()),
  slug: z
    .string()
    .min(1, "Slug majburiy")
    .regex(/^[a-z0-9-]+$/, "Faqat kichik harf, raqam va -"),
  image: z.string().optional(),
  parentId: z.string().optional(),
  productIds: z.array(z.string()),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
