import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5019";

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

function extractErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as ApiResponse<unknown>).message;
    if (message) return message;
  }
  return fallback;
}

function redirectToLogin() {
  useAuthStore.getState().clear();
  useCartStore.getState().clear();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    // Runs outside the React tree (axios interceptor), so useRouter isn't available here.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login";
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
        `${BASE_URL}/api/auth/refresh`,
        { refreshToken }
      )
      .then((res) => {
        const result = res.data.data;
        useAuthStore.getState().setTokens(result.accessToken, result.refreshToken);
        return result.accessToken;
      })
      .catch(() => {
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

interface RetryableConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const { response, config } = error;

    if (!response) {
      toast.error("Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.");
      return Promise.reject(error);
    }

    const status = response.status;
    const originalRequest = config as RetryableConfig | undefined;
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return apiClient(originalRequest);
      }
      redirectToLogin();
      return Promise.reject(error);
    }

    if (status === 401) {
      if (!isAuthEndpoint) {
        redirectToLogin();
      }
      return Promise.reject(error);
    }

    if (status === 429) {
      const retryAfterHeader = response.headers["retry-after"];
      const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
      toast.error(
        `Bạn đang thao tác quá nhanh, vui lòng thử lại sau ${retryAfter} giây.`
      );
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error(extractErrorMessage(response.data, "Bạn không có quyền thực hiện thao tác này."));
      return Promise.reject(error);
    }

    if ([400, 404, 409, 500].includes(status)) {
      const fallback =
        status === 500
          ? "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
          : "Đã xảy ra lỗi. Vui lòng thử lại.";
      toast.error(extractErrorMessage(response.data, fallback));
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown, fallback = "Đã xảy ra lỗi."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiResponse<unknown> | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
}

export function getApiFieldErrors(error: unknown): Record<string, string[]> | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiResponse<unknown> | undefined;
    if (data?.errors && !Array.isArray(data.errors)) {
      return data.errors as Record<string, string[]>;
    }
  }
  return null;
}
