export const queryKeys = {
  categories: ["categories"] as const,
  products: (query: unknown) => ["products", query] as const,
  productDetail: (id: number) => ["products", id] as const,
  adminProducts: (query: unknown) => ["admin-products", query] as const,
  adminProductDetail: (id: number) => ["admin-products", id] as const,
  discounts: ["admin-discounts"] as const,
  cart: ["cart"] as const,
  orders: (query: unknown) => ["orders", query] as const,
  orderDetail: (id: number) => ["orders", id] as const,
  adminOrders: (query: unknown) => ["admin-orders", query] as const,
  notifications: (query: unknown) => ["notifications", query] as const,
  profile: ["profile"] as const,
};
