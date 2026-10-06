"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/common/price-display";
import { useCart } from "@/hooks/use-cart";
import { CheckoutAttemptLog, useCheckout } from "@/hooks/use-orders";
import { generateIdempotencyKey } from "@/lib/idempotency";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/store/auth.store";

export default function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: cart, isLoading, refetch } = useCart();
  const checkout = useCheckout();
  const [simulateLostResponse, setSimulateLostResponse] = useState(true);
  const [demoRun, setDemoRun] = useState<{ title: string; logs: CheckoutAttemptLog[] } | null>(null);

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

  function runCheckout(idempotencyKey: string | null, title: string) {
    setDemoRun({ title, logs: [] });
    checkout.mutate({
      idempotencyKey,
      simulateLostResponse,
      onAttempt: (log) => setDemoRun((prev) => prev && { ...prev, logs: [...prev.logs, log] }),
    });
  }

  function handleConfirm() {
    if (!idempotencyKeyRef.current) return;
    runCheckout(idempotencyKeyRef.current, `Có Idempotency-Key: ${idempotencyKeyRef.current}`);
  }

  function handleConfirmNoIdempotency() {
    runCheckout(null, "Không có Idempotency-Key (POST /orders/checkout-no-idempotency)");
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

      <Button
        size="lg"
        variant="outline"
        className="w-full"
        disabled={hasBlockingIssue || checkout.isPending}
        onClick={handleConfirmNoIdempotency}
      >
        Checkout no idempotency
      </Button>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Checkbox
          checked={simulateLostResponse}
          onCheckedChange={(checked) => setSimulateLostResponse(checked === true)}
        />
        Demo: giả lập mất response của request đầu tiên và tự động retry 1 lần
      </label>

      {demoRun && (
        <Card>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{demoRun.title}</p>
            {demoRun.logs.map((log) => (
              <p key={log.attempt} className={log.ok ? "text-green-600" : "text-destructive"}>
                Request #{log.attempt}: {log.message}
              </p>
            ))}
            {checkout.isError && demoRun.logs.some((l) => l.ok) && (
              <p className="text-muted-foreground">
                Client báo thất bại, nhưng request trước đó đã tạo đơn và trừ kho.{" "}
                <Link href="/orders" className="underline">
                  Kiểm tra lịch sử đơn hàng
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
