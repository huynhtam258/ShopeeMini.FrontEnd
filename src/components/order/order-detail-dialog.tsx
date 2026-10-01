"use client";

import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { useOrderDetail } from "@/hooks/use-orders";
import { formatCurrency, formatDateTime } from "@/lib/format";

interface OrderDetailDialogProps {
  orderId: number | null;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({ orderId, onOpenChange }: OrderDetailDialogProps) {
  const { data: order, isLoading } = useOrderDetail(orderId);

  return (
    <Dialog open={orderId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết hóa đơn</DialogTitle>
        </DialogHeader>

        {isLoading || !order ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="print-invoice space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Mã đơn: {order.orderCode}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <Separator />

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variantName} · x{item.quantity}
                      {item.discountPercentApplied > 0 && ` · -${item.discountPercentApplied}%`}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium">{formatCurrency(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-base font-semibold">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => window.print()} disabled={!order}>
            <Printer className="size-4" />
            In hóa đơn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
