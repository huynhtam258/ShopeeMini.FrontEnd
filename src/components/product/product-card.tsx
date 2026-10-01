import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/common/price-display";
import { ProductListItemDto } from "@/types";

export function ProductCard({ product }: { product: ProductListItemDto }) {
  const discountPercent = product.hasActiveDiscount
    ? Math.round((1 - product.minEffectivePrice / product.minPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        <PackageSearch className="size-12 text-muted-foreground/40" strokeWidth={1.2} />
        {product.hasActiveDiscount && (
          <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
            Đang giảm giá
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="line-clamp-2 min-h-10 text-sm font-medium group-hover:text-primary">
          {product.name}
        </p>
        <Badge variant="secondary" className="w-fit text-[0.7rem]">
          {product.categoryName}
        </Badge>
        <PriceDisplay
          price={product.minPrice}
          effectivePrice={product.minEffectivePrice}
          discountPercent={product.hasActiveDiscount ? discountPercent : undefined}
          size="sm"
          className="mt-auto"
        />
      </div>
    </Link>
  );
}
