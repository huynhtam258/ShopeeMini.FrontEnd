"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartService } from "@/lib/api/cart.service";
import { getApiErrorMessage } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { AddCartItemDto, UpdateCartItemDto } from "@/types";

export function useCart() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const role = useAuthStore((s) => s.user?.role);
  const setSummary = useCartStore((s) => s.setSummary);
  const enabled = !!accessToken && role === "User";

  const query = useQuery({
    queryKey: queryKeys.cart,
    queryFn: cartService.get,
    enabled,
    staleTime: 15_000,
  });

  useEffect(() => {
    if (query.data) {
      setSummary(query.data);
    }
  }, [query.data, setSummary]);

  return query;
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  const setSummary = useCartStore((s) => s.setSummary);
  return useMutation({
    mutationFn: (payload: AddCartItemDto) => cartService.addItem(payload),
    onSuccess: (summary) => {
      setSummary(summary);
      queryClient.setQueryData(queryKeys.cart, summary);
      toast.success("Đã thêm vào giỏ hàng.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Thêm vào giỏ hàng thất bại.")),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const setSummary = useCartStore((s) => s.setSummary);
  return useMutation({
    mutationFn: ({ cartItemId, payload }: { cartItemId: number; payload: UpdateCartItemDto }) =>
      cartService.updateItem(cartItemId, payload),
    onSuccess: (summary) => {
      setSummary(summary);
      queryClient.setQueryData(queryKeys.cart, summary);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Cập nhật giỏ hàng thất bại.")),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const setSummary = useCartStore((s) => s.setSummary);
  return useMutation({
    mutationFn: (cartItemId: number) => cartService.removeItem(cartItemId),
    onSuccess: (summary) => {
      setSummary(summary);
      queryClient.setQueryData(queryKeys.cart, summary);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Xóa sản phẩm thất bại.")),
  });
}
