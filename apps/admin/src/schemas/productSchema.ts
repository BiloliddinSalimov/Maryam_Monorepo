import { z } from "zod";

export const discountSchema = z.object({
  percent: z.number().min(1, "Kamida 1%").max(100, "Maksimal 100%"),
  startDate: z.string().min(1, "Boshlanish sanasi majburiy"),
  endDate: z.string().min(1, "Tugash sanasi majburiy"),
});

export const productSchema = z.object({
  name: z
    .record(z.string(), z.string())
    .refine(
      (v) => Object.values(v).some((s) => s.trim().length > 0),
      "Mahsulot nomini kiriting",
    ),
  slug: z
    .string()
    .min(1, "Slug majburiy")
    .regex(/^[a-z0-9_-]+$/, "Faqat kichik harf, raqam, _ va -"),
  description: z.record(z.string(), z.string()),
  price: z.number().min(0, "Narx manfiy bo'lmasligi kerak"),
  stock: z.number().min(0, "Miqdor manfiy bo'lmasligi kerak"),
  categoryId: z.string().min(1, "Kategoriya tanlang"),
  images: z.array(z.string()),
  hasDiscount: z.boolean(),
  discount: discountSchema.optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
