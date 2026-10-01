"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoryService } from "@/lib/api/category.service";
import { getApiErrorMessage } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import { UpsertCategoryDto } from "@/types";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoryService.list,
    staleTime: 5 * 60_000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertCategoryDto) => categoryService.create(payload),
    onSuccess: () => {
      toast.success("Tạo danh mục thành công.");
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Tạo danh mục thất bại.")),
  });
}
