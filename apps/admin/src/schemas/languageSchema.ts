import { z } from "zod";

export const languageSchema = z.object({
  code: z
    .string()
    .min(2, "Kamida 2 ta belgi")
    .max(5, "Maksimal 5 ta belgi")
    .regex(/^[a-z]+$/, "Faqat kichik harflar"),
  name: z.string().min(1, "Nom majburiy"),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

export type LanguageFormValues = z.infer<typeof languageSchema>;
