"use client";

import Link from "next/link";
import { AlertTriangle, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/common/price-display";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CartItemDto } from "@/types";

interface CartItemRowProps {
  item: CartItemDto;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function CartItemRow({ item, onQuantityChange, onRemove, disabled }: CartItemRowProps) {
  const isOutOfStock = item.availableStock <= 0;
  const isInsufficientStock = !isOutOfStock && item.availableStock < item.quantity;
  const hasWarning = isOutOfStock || isInsufficientStock;

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg border p-4",
        hasWarning && "border-destructive/40 bg-destructive/5"
      )}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <Link href={`/products/${item.productId}`} className="line-clamp-2 text-sm font-medium hover:text-primary">
          {item.productName}
        </Link>
        <p className="text-xs text-muted-foreground">Phân loại: {item.variantName}</p>

        {hasWarning && (
          <p className="flex items-center gap-1 text-xs font-medium text-destructive">
            <AlertTriangle className="size-3.5" />
            {isOutOfStock
              ? "Sản phẩm tạm thời hết hàng. Vui lòng xóa khỏi giỏ hàng để tiếp tục thanh toán."
              : `Chỉ còn ${item.availableStock} sản phẩm trong kho. Vui lòng giảm số lượng.`}
          </p>
        )}

        <PriceDisplay
          price={item.unitPrice}
          effectivePrice={item.effectivePrice}
          discountPercent={item.discountPercent}
          size="sm"
        />

        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={item.quantity <= 1 || disabled}
              onClick={() => onQuantityChange(item.quantity - 1)}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              onClick={() => onQuantityChange(item.quantity + 1)}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            disabled={disabled}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-primary">{formatCurrency(item.lineTotal)}</p>
      </div>
    </div>
  );
}
