"use client";

import { cn } from "@/lib/utils";
import { SkuDto } from "@/types";

interface SkuSelectorProps {
  skus: SkuDto[];
  selectedSkuId: number | null;
  onSelect: (skuId: number) => void;
}

export function SkuSelector({ skus, selectedSkuId, onSelect }: SkuSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Phân loại</p>
      <div className="flex flex-wrap gap-2">
        {skus.map((sku) => {
          const outOfStock = sku.stockQuantity <= 0;
          const selected = selectedSkuId === sku.id;
          return (
            <button
              key={sku.id}
              type="button"
              disabled={outOfStock}
              onClick={() => onSelect(sku.id)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                selected && "border-primary bg-primary/10 text-primary font-medium",
                !selected && !outOfStock && "hover:border-primary/50",
                outOfStock && "cursor-not-allowed border-dashed text-muted-foreground line-through opacity-60"
              )}
            >
              {sku.variantName}
              {outOfStock && " (Hết hàng)"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
