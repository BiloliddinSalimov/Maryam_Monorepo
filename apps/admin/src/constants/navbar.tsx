import {
  LayoutDashboard,
  Tag,
  Package,
  Image,
  ShoppingCart,
  Settings,
  LayoutTemplate,
} from "lucide-react";

export const NAV = [
  { path: "/",           label: "Home",              icon: LayoutDashboard },
  { path: "/categories", label: "Kategoriyalar",     icon: Tag },
  { path: "/products",   label: "Mahsulotlar",       icon: Package },
  { path: "/banners",    label: "Bannerlar",         icon: Image },
  { path: "/homepage",   label: "Bosh sahifa",       icon: LayoutTemplate },
  { path: "/orders",     label: "Buyurtmalar",       icon: ShoppingCart },
  { path: "/settings",   label: "Sozlamalar",        icon: Settings },
];
