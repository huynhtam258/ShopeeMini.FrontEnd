"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductService, discountService, productService } from "@/lib/api/product.service";
import { getApiErrorMessage } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import {
  CreateDiscountDto,
  CreateProductDto,
  CreateSkuDto,
  ProductQuery,
  UpdateProductDto,
  UpdateProductStatusDto,
  UpdateSkuPriceDto,
  UpdateStockDto,
} from "@/types";

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: queryKeys.products(query),
    queryFn: () => productService.list(query),
    placeholderData: (prev) => prev,
  });
}

export function useProductDetail(id: number | null) {
  return useQuery({
    queryKey: queryKeys.productDetail(id ?? 0),
    queryFn: () => productService.detail(id as number),
    enabled: id !== null,
  });
}

export function useAdminProducts(query: ProductQuery) {
  return useQuery({
    queryKey: queryKeys.adminProducts(query),
    queryFn: () => adminProductService.list(query),
    placeholderData: (prev) => prev,
  });
}

export function useAdminProductDetail(id: number | null) {
  return useQuery({
    queryKey: queryKeys.adminProductDetail(id ?? 0),
    queryFn: () => adminProductService.detail(id as number),
    enabled: id !== null,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductDto) => adminProductService.create(payload),
    onSuccess: () => {
      toast.success("Tạo sản phẩm thành công.");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Tạo sản phẩm thất bại.")),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductDto }) =>
      adminProductService.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật sản phẩm thành công.");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminProductDetail(variables.id) });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Cập nhật sản phẩm thất bại.")),
  });
}

export function useSetProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductStatusDto }) =>
      adminProductService.setStatus(id, payload),
    onSuccess: (message) => {
      toast.success(message ?? "Cập nhật trạng thái thành công.");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Cập nhật trạng thái thất bại.")),
  });
}

export function useAddSku() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, payload }: { productId: number; payload: CreateSkuDto }) =>
      adminProductService.addSku(productId, payload),
    onSuccess: (_data, variables) => {
      toast.success("Thêm biến thể thành công.");
      queryClient.invalidateQueries({ queryKey: queryKeys.adminProductDetail(variables.productId) });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Thêm biến thể thất bại.")),
  });
}

export function useUpdateSkuStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ skuId, payload }: { skuId: number; payload: UpdateStockDto }) =>
      adminProductService.updateStock(skuId, payload),
    onSuccess: () => {
      toast.success("Cập nhật tồn kho thành công.");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Cập nhật tồn kho thất bại.")),
  });
}

export function useUpdateSkuPrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ skuId, payload }: { skuId: number; payload: UpdateSkuPriceDto }) =>
      adminProductService.updatePrice(skuId, payload),
    onSuccess: () => {
      toast.success("Cập nhật giá thành công.");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Cập nhật giá thất bại.")),
  });
}

export function useDiscounts() {
  return useQuery({
    queryKey: queryKeys.discounts,
    queryFn: discountService.list,
  });
}

export function useCreateDiscount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDiscountDto) => discountService.create(payload),
    onSuccess: () => {
      toast.success("Cấu hình giảm giá thành công.");
      queryClient.invalidateQueries({ queryKey: queryKeys.discounts });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Cấu hình giảm giá thất bại.")),
  });
}

export function useDeleteDiscount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => discountService.remove(id),
    onSuccess: (message) => {
      toast.success(message ?? "Đã hủy giảm giá.");
      queryClient.invalidateQueries({ queryKey: queryKeys.discounts });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Hủy giảm giá thất bại.")),
  });
}
