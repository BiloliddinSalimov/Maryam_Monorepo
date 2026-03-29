import type React from "react";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar onLogout={logout} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
