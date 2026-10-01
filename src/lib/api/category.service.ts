import { apiClient } from "./client";
import { ApiResponse, CategoryDto, UpsertCategoryDto } from "@/types";

export const categoryService = {
  async list() {
    const res = await apiClient.get<ApiResponse<CategoryDto[]>>("/categories");
    return res.data.data;
  },

  async create(payload: UpsertCategoryDto) {
    const res = await apiClient.post<ApiResponse<CategoryDto>>("/admin/categories", payload);
    return res.data.data;
  },

  async update(id: number, payload: UpsertCategoryDto) {
    const res = await apiClient.put<ApiResponse<CategoryDto>>(`/admin/categories/${id}`, payload);
    return res.data.data;
  },

  async remove(id: number) {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/categories/${id}`);
    return res.data.message;
  },
};
