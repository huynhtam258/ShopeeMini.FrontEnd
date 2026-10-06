"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
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

export interface CheckoutAttemptLog {
  attempt: number;
  ok: boolean;
  message: string;
}

interface CheckoutVariables {
  /** null → call the demo endpoint that has NO idempotency protection. */
  idempotencyKey: string | null;
  /**
   * Demo: the first request reaches the server and is processed, but we pretend its response
   * was lost (timeout / dropped wifi) and retry once — exactly what a real client would do.
   */
  simulateLostResponse: boolean;
  onAttempt?: (log: CheckoutAttemptLog) => void;
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ idempotencyKey, simulateLostResponse, onAttempt }: CheckoutVariables) => {
      const send = () =>
        idempotencyKey ? orderService.checkout(idempotencyKey) : orderService.checkoutNoIdempotency();
      const totalAttempts = simulateLostResponse ? 2 : 1;

      for (let attempt = 1; ; attempt++) {
        const isLast = attempt === totalAttempts;
        try {
          const order = await send();
          onAttempt?.({
            attempt,
            ok: true,
            message: isLast
              ? `201 — đơn ${order.orderCode}`
              : `201 — đơn ${order.orderCode} (giả lập: client KHÔNG nhận được response này → retry)`,
          });
          if (isLast) return order;
        } catch (error) {
          const status = isAxiosError(error) ? error.response?.status ?? "network" : "error";
          onAttempt?.({ attempt, ok: false, message: `${status} — ${getApiErrorMessage(error, "Lỗi")}` });
          if (isLast) throw error;
        }
      }
    },
    onSuccess: (order) => {
      toast.success(`Đặt hàng thành công! Mã đơn: ${order.orderCode}`);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/orders?highlight=${order.id}`);
    },
    onError: (error) => {
      // A failed final attempt doesn't mean nothing happened server-side (an earlier attempt may
      // have created an order), so refresh order history. The cart is left as-is on purpose so the
      // demo log on the checkout page stays visible instead of bouncing to an empty /cart.
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.error(getApiErrorMessage(error, "Đặt hàng thất bại. Vui lòng thử lại."));
    },
  });
}
