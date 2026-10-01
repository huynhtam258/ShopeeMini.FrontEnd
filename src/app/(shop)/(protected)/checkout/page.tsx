"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/common/price-display";
import { useCart } from "@/hooks/use-cart";
import { useCheckout } from "@/hooks/use-orders";
import { generateIdempotencyKey } from "@/lib/idempotency";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/auth.store";

export default function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: cart, isLoading, refetch } = useCart();
  const checkout = useCheckout();

  const idempotencyKeyRef = useRef<string | null>(null);
  if (idempotencyKeyRef.current === null) {
    idempotencyKeyRef.current = generateIdempotencyKey();
  }

  // An empty cart on first read here can be a transient stale fetch (e.g. right after
  // navigating straight from adding an item), so re-verify before bouncing the user
  // back to /cart instead of trusting a single empty response.
  const hasRetriedEmptyCart = useRef(false);

  useEffect(() => {
    if (user && user.role !== "User") {
      router.replace("/admin/products");
    }
  }, [user, router]);

  useEffect(() => {
    if (isLoading || !cart) return;

    if (cart.items.length > 0) {
      hasRetriedEmptyCart.current = false;
      return;
    }

    if (!hasRetriedEmptyCart.current) {
      hasRetriedEmptyCart.current = true;
      refetch().then((result) => {
        if (result.data && result.data.items.length === 0) {
          toast.info("Giỏ hàng trống, không thể thanh toán.");
          router.replace("/cart");
        }
      });
    }
  }, [isLoading, cart, refetch, router]);

  if (isLoading || !cart || cart.items.length === 0) {
    return <p className="py-10 text-center text-muted-foreground">Đang tải thông tin thanh toán...</p>;
  }

  const hasBlockingIssue = cart.items.some((i) => i.availableStock <= 0 || i.availableStock < i.quantity);

  function handleConfirm() {
    if (!idempotencyKeyRef.current) return;
    checkout.mutate(idempotencyKeyRef.current);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-lg font-semibold">Xác nhận đơn hàng</h1>

      {hasBlockingIssue && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Không thể đặt hàng</AlertTitle>
          <AlertDescription>
            Giỏ hàng có sản phẩm hết hàng hoặc không đủ số lượng tồn kho. Vui lòng quay lại giỏ hàng để điều chỉnh.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-medium">Sản phẩm ({cart.items.length})</h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 border-b pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.variantName} · x{item.quantity}
                  </p>
                </div>
                <PriceDisplay
                  price={item.unitPrice * item.quantity}
                  effectivePrice={item.lineTotal}
                  discountPercent={item.discountPercent}
                  size="sm"
                />
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between text-base font-semibold">
            <span>Tổng thanh toán</span>
            <span className="text-primary">{formatCurrency(cart.totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full"
        disabled={hasBlockingIssue || checkout.isPending}
        onClick={handleConfirm}
      >
        {checkout.isPending && <Loader2 className="size-4 animate-spin" />}
        {checkout.isPending ? "Đang xử lý đơn hàng..." : "Xác nhận đặt hàng"}
      </Button>
    </div>
  );
}
