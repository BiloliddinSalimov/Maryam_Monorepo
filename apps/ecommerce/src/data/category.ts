import { useTranslation } from "react-i18next";

const { t } = useTranslation();

export const categories = [
  {
    title: t("categories.clothing"),
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
    path: "/category/clothing",
    gridClass: "lg:col-span-2 lg:row-span-1", // Tepada gorizontal katta
  },
  {
    title: t("categories.bags"),
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1974&auto=format&fit=crop",
    path: "/category/bags",
    gridClass: "lg:col-span-1 lg:row-span-1", // O'ng tepa kichik
  },
  {
    title: t("categories.shoes"),
    image:
      "https://mariam-col.com/cdn/shop/files/elegant-solid-color-abaya-for-muslimahs-ma036-348069.jpg?v=1746495095&width=1200",
    path: "/category/shoes",
    gridClass: "lg:col-span-1 lg:row-span-1", // Chap past kichik
  },
  {
    title: t("categories.jewelry"),
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop",
    path: "/category/jewelry",
    gridClass: "lg:col-span-1 lg:row-span-1", // O'rta past kichik
  },
  {
    title: t("categories.outerwear"),
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=2071&auto=format&fit=crop",
    path: "/category/outerwear",
    gridClass: "lg:col-span-1 lg:row-span-1", // O'ng past kichik
  },
];
