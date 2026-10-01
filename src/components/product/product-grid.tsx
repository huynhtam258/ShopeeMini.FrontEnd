import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product/product-card";
import { ProductListItemDto } from "@/types";

interface ProductGridProps {
  products: ProductListItemDto[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4.2] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState title="Không tìm thấy sản phẩm nào" description="Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
