import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Layout from "@/layouts/index";

// ── Lazy-loaded pages — each becomes its own JS chunk ────────────────────────
// Loaded only when the user first visits that route, not on app boot
const LoginPage        = lazy(() => import("@/pages/LoginPage"));
const HomePage         = lazy(() => import("@/pages/HomePage"));
const CategoriesPage   = lazy(() => import("@/pages/CategoriesPage"));
const CategoryFormPage = lazy(() => import("@/pages/CategoryFormPage"));
const ProductsPage     = lazy(() => import("@/pages/ProductsPage"));
const ProductFormPage  = lazy(() => import("@/pages/ProductFormPage"));
const BannersPage      = lazy(() => import("@/pages/BannersPage"));
const BannerFormPage   = lazy(() => import("@/pages/BannerFormPage"));
const HomepagePage     = lazy(() => import("@/pages/HomepagePage"));
const SectionFormPage  = lazy(() => import("@/pages/SectionFormPage"));
const OrdersPage       = lazy(() => import("@/pages/OrdersPage"));
const SettingsPage     = lazy(() => import("@/pages/SettingsPage"));
const LanguagesPage    = lazy(() => import("@/pages/LanguagesPage"));

// ── Minimal page-transition spinner ─────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-7 h-7 border-2 border-zinc-200 border-t-zinc-700 rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoutes() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/create" element={<CategoryFormPage />} />
          <Route path="categories/:id/edit" element={<CategoryFormPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/create" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="banners/create" element={<BannerFormPage />} />
          <Route path="banners/:id/edit" element={<BannerFormPage />} />
          <Route path="homepage" element={<HomepagePage />} />
          <Route path="homepage/create" element={<SectionFormPage />} />
          <Route path="homepage/:id/edit" element={<SectionFormPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="languages" element={<LanguagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function App() {
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = !!token;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Suspense fallback={<PageLoader />}>
                <LoginPage />
              </Suspense>
            )
          }
        />
        <Route
          path="/*"
          element={
            isLoggedIn ? <ProtectedRoutes /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}
