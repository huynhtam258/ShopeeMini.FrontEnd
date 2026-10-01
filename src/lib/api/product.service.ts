import { apiClient } from "./client";
import {
  ApiResponse,
  CreateDiscountDto,
  CreateProductDto,
  CreateSkuDto,
  DiscountDto,
  PagedResult,
  ProductDetailDto,
  ProductListItemDto,
  ProductQuery,
  SkuDto,
  UpdateProductDto,
  UpdateProductStatusDto,
  UpdateSkuPriceDto,
  UpdateStockDto,
} from "@/types";

export const productService = {
  async list(query: ProductQuery) {
    const res = await apiClient.get<ApiResponse<PagedResult<ProductListItemDto>>>("/products", {
      params: query,
    });
    return res.data.data;
  },

  async detail(id: number) {
    const res = await apiClient.get<ApiResponse<ProductDetailDto>>(`/products/${id}`);
    return res.data.data;
  },
};

export const adminProductService = {
  async list(query: ProductQuery) {
    const res = await apiClient.get<ApiResponse<PagedResult<ProductListItemDto>>>(
      "/admin/products",
      { params: query }
    );
    return res.data.data;
  },

  async detail(id: number) {
    const res = await apiClient.get<ApiResponse<ProductDetailDto>>(`/admin/products/${id}`);
    return res.data.data;
  },

  async create(payload: CreateProductDto) {
    const res = await apiClient.post<ApiResponse<ProductDetailDto>>("/admin/products", payload);
    return res.data.data;
  },

  async update(id: number, payload: UpdateProductDto) {
    const res = await apiClient.put<ApiResponse<ProductDetailDto>>(`/admin/products/${id}`, payload);
    return res.data.data;
  },

  async setStatus(id: number, payload: UpdateProductStatusDto) {
    const res = await apiClient.put<ApiResponse<null>>(`/admin/products/${id}/status`, payload);
    return res.data.message;
  },

  async addSku(productId: number, payload: CreateSkuDto) {
    const res = await apiClient.post<ApiResponse<SkuDto>>(
      `/admin/products/${productId}/skus`,
      payload
    );
    return res.data.data;
  },

  async updateStock(skuId: number, payload: UpdateStockDto) {
    const res = await apiClient.put<ApiResponse<SkuDto>>(
      `/admin/products/skus/${skuId}/stock`,
      payload
    );
    return res.data.data;
  },

  async updatePrice(skuId: number, payload: UpdateSkuPriceDto) {
    const res = await apiClient.put<ApiResponse<SkuDto>>(
      `/admin/products/skus/${skuId}/price`,
      payload
    );
    return res.data.data;
  },
};

export const discountService = {
  async list() {
    const res = await apiClient.get<ApiResponse<DiscountDto[]>>("/admin/discounts");
    return res.data.data;
  },

  async create(payload: CreateDiscountDto) {
    const res = await apiClient.post<ApiResponse<DiscountDto>>("/admin/discounts", payload);
    return res.data.data;
  },

  async remove(id: number) {
    const res = await apiClient.delete<ApiResponse<null>>(`/admin/discounts/${id}`);
    return res.data.message;
  },
};
