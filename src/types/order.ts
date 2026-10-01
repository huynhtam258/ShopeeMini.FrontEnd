import { PaginationQuery } from "./common";
import { OrderStatus } from "./enums";

export interface OrderQuery extends PaginationQuery {
  status?: OrderStatus;
}

export interface OrderItemDto {
  productSkuId: number;
  shopId: number;
  productName: string;
  variantName: string;
  unitPrice: number;
  discountPercentApplied: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDto {
  id: number;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  invoiceJsonPath: string | null;
  items: OrderItemDto[];
}

export interface OrderListItemDto {
  id: number;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

export interface AdminOrderLineDto {
  orderId: number;
  orderCode: string;
  orderStatus: OrderStatus;
  buyerName: string;
  buyerEmail: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  discountPercentApplied: number;
  quantity: number;
  lineTotal: number;
  createdAt: string;
}
