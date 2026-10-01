import { apiClient } from "./client";
import { AddCartItemDto, ApiResponse, CartSummaryDto, UpdateCartItemDto } from "@/types";

export const cartService = {
  async get() {
    const res = await apiClient.get<ApiResponse<CartSummaryDto>>("/cart");
    return res.data.data;
  },

  async addItem(payload: AddCartItemDto) {
    const res = await apiClient.post<ApiResponse<CartSummaryDto>>("/cart/items", payload);
    return res.data.data;
  },

  async updateItem(cartItemId: number, payload: UpdateCartItemDto) {
    const res = await apiClient.put<ApiResponse<CartSummaryDto>>(
      `/cart/items/${cartItemId}`,
      payload
    );
    return res.data.data;
  },

  async removeItem(cartItemId: number) {
    const res = await apiClient.delete<ApiResponse<CartSummaryDto>>(`/cart/items/${cartItemId}`);
    return res.data.data;
  },
};
