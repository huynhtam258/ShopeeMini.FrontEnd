import { apiClient } from "./client";
import {
  AdminOrderLineDto,
  ApiResponse,
  OrderDto,
  OrderListItemDto,
  OrderQuery,
  PagedResult,
} from "@/types";

export const orderService = {
  async checkout(idempotencyKey: string) {
    const res = await apiClient.post<ApiResponse<OrderDto>>(
      "/orders/checkout",
      {},
      { headers: { "Idempotency-Key": idempotencyKey } }
    );
    return res.data.data;
  },

  async list(query: OrderQuery) {
    const res = await apiClient.get<ApiResponse<PagedResult<OrderListItemDto>>>("/orders", {
      params: query,
    });
    return res.data.data;
  },

  async detail(id: number) {
    const res = await apiClient.get<ApiResponse<OrderDto>>(`/orders/${id}`);
    return res.data.data;
  },
};

export const adminOrderService = {
  async list(query: OrderQuery) {
    const res = await apiClient.get<ApiResponse<PagedResult<AdminOrderLineDto>>>(
      "/admin/orders",
      { params: query }
    );
    return res.data.data;
  },
};
