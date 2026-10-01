"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminOrderService, orderService } from "@/lib/api/order.service";
import { getApiErrorMessage } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import { OrderQuery } from "@/types";

export function useOrders(query: OrderQuery) {
  return useQuery({
    queryKey: queryKeys.orders(query),
    queryFn: () => orderService.list(query),
    placeholderData: (prev) => prev,
  });
}

export function useOrderDetail(id: number | null) {
  return useQuery({
    queryKey: queryKeys.orderDetail(id ?? 0),
    queryFn: () => orderService.detail(id as number),
    enabled: id !== null,
  });
}

export function useAdminOrders(query: OrderQuery) {
  return useQuery({
    queryKey: queryKeys.adminOrders(query),
    queryFn: () => adminOrderService.list(query),
    placeholderData: (prev) => prev,
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (idempotencyKey: string) => orderService.checkout(idempotencyKey),
    onSuccess: (order) => {
      toast.success(`Đặt hàng thành công! Mã đơn: ${order.orderCode}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/orders?highlight=${order.id}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Đặt hàng thất bại. Vui lòng thử lại."));
    },
  });
}
