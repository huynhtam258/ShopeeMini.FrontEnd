export interface AddCartItemDto {
  productSkuId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartItemDto {
  id: number;
  productSkuId: number;
  productId: number;
  productName: string;
  variantName: string;
  unitPrice: number;
  effectivePrice: number;
  discountPercent: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
}

export interface CartSummaryDto {
  items: CartItemDto[];
  totalAmount: number;
}
