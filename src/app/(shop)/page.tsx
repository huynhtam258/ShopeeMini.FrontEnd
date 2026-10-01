"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductFilterSidebar, ProductFilters } from "@/components/product/product-filter-sidebar";
import { ProductGrid } from "@/components/product/product-grid";
import { PaginationControl } from "@/components/common/pagination-control";
import { useProducts } from "@/hooks/use-products";

const PAGE_SIZE = 12;

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>({});

  const query = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      search: search || undefined,
      categoryId: filters.categoryId,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    }),
    [page, search, filters.categoryId, filters.fromDate, filters.toDate]
  );

  const { data, isLoading, isFetching } = useProducts(query);

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((item) => {
      if (filters.minPrice !== undefined && item.minEffectivePrice < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && item.minEffectivePrice > filters.maxPrice) return false;
      return true;
    });
  }, [data?.items, filters.minPrice, filters.maxPrice]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <ProductFilterSidebar
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onReset={() => {
          setFilters({});
          setPage(1);
        }}
      />

      <div className="flex-1 space-y-4">
        {search && (
          <p className="text-sm text-muted-foreground">
            Kết quả tìm kiếm cho: <span className="font-medium text-foreground">&quot;{search}&quot;</span>
          </p>
        )}

        <ProductGrid products={filteredItems} isLoading={isLoading || (isFetching && !data)} />

        {data && (
          <div className="flex justify-center pt-4">
            <PaginationControl page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
