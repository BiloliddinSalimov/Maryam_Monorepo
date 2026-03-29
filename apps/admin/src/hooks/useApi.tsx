import { instance } from "@/lib/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

// Shared invalidate helper — forces immediate refetch for all observers
async function invalidateAll(qc: ReturnType<typeof useQueryClient>, keys: QueryKey[]) {
  await Promise.all(
    keys.map((key) =>
      qc.invalidateQueries({ queryKey: key, refetchType: "all" }),
    ),
  );
}

// ─── GET ────────────────────────────────────────────────────────────────────

export function useGet<TData = unknown>(
  url: string,
  queryKey: QueryKey,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">,
) {
  return useQuery<TData>({
    queryKey,
    queryFn: async () => {
      const { data } = await instance.get<TData>(url);
      return data;
    },
    // staleTime & refetchOnWindowFocus come from the global QueryClient config
    // Individual hooks can still override via the `options` argument
    ...options,
  });
}

// ─── POST ───────────────────────────────────────────────────────────────────

export function usePost<
  TData = unknown,
  TVariables = unknown,
  TContext = unknown,
>(
  url: string,
  invalidateKeys?: QueryKey[],
  options?: UseMutationOptions<TData, Error, TVariables, TContext>,
) {
  const qc = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: async (body) => {
      const { data } = await instance.post<TData>(url, body);
      return data;
    },
    onSuccess: async (...args) => {
      if (invalidateKeys) await invalidateAll(qc, invalidateKeys);
      await onSuccess?.(...args);
    },
    ...restOptions,
  });
}

// ─── PUT ────────────────────────────────────────────────────────────────────

export function usePut<
  TData = unknown,
  TVariables = unknown,
  TContext = unknown,
>(
  url: string,
  invalidateKeys?: QueryKey[],
  options?: UseMutationOptions<TData, Error, TVariables, TContext>,
) {
  const qc = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: async (body) => {
      const { data } = await instance.put<TData>(url, body);
      return data;
    },
    onSuccess: async (...args) => {
      if (invalidateKeys) await invalidateAll(qc, invalidateKeys);
      await onSuccess?.(...args);
    },
    ...restOptions,
  });
}

// ─── PATCH ──────────────────────────────────────────────────────────────────

export function usePatch<
  TData = unknown,
  TVariables = unknown,
  TContext = unknown,
>(
  url: string,
  invalidateKeys?: QueryKey[],
  options?: UseMutationOptions<TData, Error, TVariables, TContext>,
) {
  const qc = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: async (body) => {
      const { data } = await instance.patch<TData>(url, body);
      return data;
    },
    onSuccess: async (...args) => {
      if (invalidateKeys) await invalidateAll(qc, invalidateKeys);
      await onSuccess?.(...args);
    },
    ...restOptions,
  });
}

// ─── DELETE ─────────────────────────────────────────────────────────────────

export function useDelete<TData = unknown, TContext = unknown>(
  url: string,
  invalidateKeys?: QueryKey[],
  options?: UseMutationOptions<TData, Error, string | number, TContext>,
) {
  const qc = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation<TData, Error, string | number, TContext>({
    mutationFn: async (id) => {
      const { data } = await instance.delete<TData>(`${url}/${id}`);
      return data;
    },
    onSuccess: async (...args) => {
      if (invalidateKeys) await invalidateAll(qc, invalidateKeys);
      await onSuccess?.(...args);
    },
    ...restOptions,
  });
}
