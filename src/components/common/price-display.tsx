import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  effectivePrice?: number;
  discountPercent?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceDisplay({
  price,
  effectivePrice,
  discountPercent,
  size = "md",
  className,
}: PriceDisplayProps) {
  const hasDiscount =
    effectivePrice !== undefined && discountPercent !== undefined && discountPercent > 0;

  const mainClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  }[size];

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-primary", mainClass)}>
        {formatCurrency(hasDiscount ? effectivePrice! : price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-xs text-muted-foreground line-through">
            {formatCurrency(price)}
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
