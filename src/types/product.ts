import { PaginationQuery } from "./common";

export interface ProductQuery extends PaginationQuery {
  categoryId?: number;
  search?: string;
}

export interface SkuDto {
  id: number;
  skuCode: string;
  variantName: string;
  price: number;
  effectivePrice: number;
  activeDiscountPercent: number;
  stockQuantity: number;
}

export interface ProductListItemDto {
  id: number;
  name: string;
  categoryName: string;
  isPublic: boolean;
  minPrice: number;
  maxEffectivePrice: number;
  minEffectivePrice: number;
  hasActiveDiscount: boolean;
  createdAt: string;
}

export interface ProductDetailDto {
  id: number;
  shopId: number;
  shopName: string;
  categoryId: number;
  categoryName: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  skus: SkuDto[];
}

export interface CreateSkuDto {
  skuCode: string;
  variantName: string;
  price: number;
  stockQuantity: number;
}

export interface CreateProductDto {
  categoryId: number;
  name: string;
  description?: string | null;
  skus: CreateSkuDto[];
}

export interface UpdateProductDto {
  categoryId: number;
  name: string;
  description?: string | null;
}

export interface UpdateProductStatusDto {
  isPublic: boolean;
}

export interface UpdateStockDto {
  stockQuantity: number;
}

export interface UpdateSkuPriceDto {
  price: number;
}

export interface CreateDiscountDto {
  productSkuId: number;
  discountPercent: number;
  startAt: string;
  endAt: string;
}

export interface DiscountDto {
  id: number;
  productSkuId: number;
  skuVariantName: string;
  discountPercent: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
}
