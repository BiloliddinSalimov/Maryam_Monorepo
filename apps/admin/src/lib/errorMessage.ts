import type { AxiosError } from "axios";

interface ApiErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Extracts a human-readable error message from any thrown value.
 *
 * API response body shapes we handle:
 *   { message: "..." }                  — single string
 *   { message: ["...", "..."] }         — NestJS validation array → first item
 *   { error: "..." }                    — fallback field
 *
 * If nothing useful is found, returns the provided `fallback`.
 */
export function getErrorMessage(
  err: unknown,
  fallback = "Xatolik yuz berdi",
): string {
  if (!err) return fallback;

  // Axios error with response body
  const axiosErr = err as AxiosError<ApiErrorBody>;
  if (axiosErr.isAxiosError && axiosErr.response?.data) {
    const body = axiosErr.response.data;

    if (typeof body.message === "string" && body.message.trim()) {
      return body.message.trim();
    }
    if (Array.isArray(body.message) && body.message.length > 0) {
      return body.message[0];
    }
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error.trim();
    }
  }

  // Plain JS Error
  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}
