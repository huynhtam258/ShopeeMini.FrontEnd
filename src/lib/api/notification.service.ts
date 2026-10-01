import { apiClient } from "./client";
import { ApiResponse, NotificationDto, NotificationQuery, PagedResult } from "@/types";

export const notificationService = {
  async list(query: NotificationQuery) {
    const res = await apiClient.get<ApiResponse<PagedResult<NotificationDto>>>(
      "/notifications",
      { params: query }
    );
    return res.data.data;
  },

  async markAsRead(id: number) {
    const res = await apiClient.put<ApiResponse<null>>(`/notifications/${id}/read`);
    return res.data.message;
  },

  async remove(id: number) {
    const res = await apiClient.delete<ApiResponse<null>>(`/notifications/${id}`);
    return res.data.message;
  },
};
