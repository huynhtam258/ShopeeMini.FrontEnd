"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export default function CartPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  useEffect(() => {
    if (user && user.role !== "User") {
      toast.error("Chỉ tài khoản khách hàng mới có thể dùng giỏ hàng.");
      router.replace("/admin/products");
    }
  }, [user, router]);

  if (user && user.role !== "User") return null;

  if (isLoading) {
    return <p className="py-10 text-center text-muted-foreground">Đang tải giỏ hàng...</p>;
  }

  const items = cart?.items ?? [];
  const hasBlockingIssue = items.some((i) => i.availableStock <= 0 || i.availableStock < i.quantity);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Giỏ hàng của bạn đang trống"
        description="Hãy khám phá và thêm sản phẩm yêu thích vào giỏ hàng."
        action={
          <Link href="/" className={cn(buttonVariants())}>
            Tiếp tục mua sắm
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <h1 className="text-lg font-semibold">Giỏ hàng ({items.length} sản phẩm)</h1>
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            disabled={updateItem.isPending || removeItem.isPending}
            onQuantityChange={(q) =>
              updateItem.mutate({ cartItemId: item.id, payload: { quantity: q } })
            }
            onRemove={() => removeItem.mutate(item.id)}
          />
        ))}
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardContent className="space-y-4">
            <h2 className="font-semibold">Tổng đơn hàng</h2>

            {hasBlockingIssue && (
              <Alert variant="destructive">
                <AlertTriangle className="size-4" />
                <AlertTitle>Không thể thanh toán</AlertTitle>
                <AlertDescription>
                  Có sản phẩm hết hàng hoặc không đủ số lượng. Vui lòng điều chỉnh giỏ hàng trước khi tiếp tục.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính</span>
              <span className="font-medium">{formatCurrency(cart?.totalAmount ?? 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-semibold">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatCurrency(cart?.totalAmount ?? 0)}</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={hasBlockingIssue}
              onClick={() => router.push("/checkout")}
            >
              Thanh toán
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
