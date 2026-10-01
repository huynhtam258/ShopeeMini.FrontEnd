"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/lib/api/auth.service";
import { getApiErrorMessage } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import {
  ChangePasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
} from "@/types";

export function useProfile() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: authService.getProfile,
    enabled: !!accessToken,
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const setAuthResult = useAuthStore((s) => s.setAuthResult);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequestDto) => authService.login(payload),
    onSuccess: (result) => {
      setAuthResult(result);
      queryClient.invalidateQueries();
      toast.success(`Chào mừng trở lại, ${result.fullName}!`);
      router.push(result.role === "Admin" ? "/admin/products" : "/");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Đăng nhập thất bại."));
    },
  });
}

export function useRegister() {
  const setAuthResult = useAuthStore((s) => s.setAuthResult);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterRequestDto) => authService.register(payload),
    onSuccess: (result) => {
      setAuthResult(result);
      toast.success("Đăng ký thành công!");
      router.push("/");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Đăng ký thất bại."));
    },
  });
}

export function useLogout() {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clear = useAuthStore((s) => s.clear);
  const clearCart = useCartStore((s) => s.clear);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await authService.logout({ refreshToken }).catch(() => undefined);
      }
    },
    onSettled: () => {
      clear();
      clearCart();
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequestDto) => authService.changePassword(payload),
    onSuccess: (message) => {
      toast.success(message ?? "Đổi mật khẩu thành công.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Đổi mật khẩu thất bại."));
    },
  });
}
