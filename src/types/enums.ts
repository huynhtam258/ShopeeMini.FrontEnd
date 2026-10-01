export type UserRole = "User" | "Admin";

export type OrderStatus = "Pending" | "Paid" | "Failed" | "Cancelled";

export type NotificationType =
  | "OrderPlacedSuccess"
  | "OrderPlacedFailed"
  | "NewOrderForShop"
  | "ProductHiddenRemovedFromCart";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  Pending: "Đang xử lý",
  Paid: "Hoàn thành",
  Failed: "Thất bại",
  Cancelled: "Đã hủy",
};

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  OrderPlacedSuccess: "Đặt hàng thành công",
  OrderPlacedFailed: "Đặt hàng thất bại",
  NewOrderForShop: "Đơn hàng mới",
  ProductHiddenRemovedFromCart: "Sản phẩm đã bị ẩn",
};
