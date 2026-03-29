import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // Cache data for 3 minutes — no refetch on every mount / route change
      staleTime: 1000 * 60 * 3,
      // Keep unused query data in memory for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Don't refetch just because the user switched tabs
      refetchOnWindowFocus: false,
      // Don't refetch when the network reconnects (admin app is always online)
      refetchOnReconnect: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  </StrictMode>,
);
