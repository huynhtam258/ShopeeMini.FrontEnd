"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
import { CategoryDto } from "@/types";

export interface ProductFilters {
  categoryId?: number;
  fromDate?: string;
  toDate?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface ProductFilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onReset: () => void;
}

function buildCategoryTree(categories: CategoryDto[]) {
  const roots = categories.filter((c) => c.parentCategoryId === null);
  const children = (parentId: number) => categories.filter((c) => c.parentCategoryId === parentId);
  return { roots, children };
}

export function ProductFilterSidebar({ filters, onChange, onReset }: ProductFilterSidebarProps) {
  const { data: categories = [] } = useCategories();
  const { roots, children } = buildCategoryTree(categories);

  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-64">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Danh mục</h3>
        </div>
        <div className="space-y-1">
          <button
            className={cn(
              "block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted",
              !filters.categoryId && "bg-primary/10 font-medium text-primary"
            )}
            onClick={() => onChange({ ...filters, categoryId: undefined })}
          >
            Tất cả danh mục
          </button>
          {roots.map((cat) => (
            <div key={cat.id}>
              <button
                className={cn(
                  "block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted",
                  filters.categoryId === cat.id && "bg-primary/10 font-medium text-primary"
                )}
                onClick={() => onChange({ ...filters, categoryId: cat.id })}
              >
                {cat.name}
              </button>
              {children(cat.id).map((child) => (
                <button
                  key={child.id}
                  className={cn(
                    "block w-full rounded px-2 py-1.5 pl-5 text-left text-sm hover:bg-muted",
                    filters.categoryId === child.id && "bg-primary/10 font-medium text-primary"
                  )}
                  onClick={() => onChange({ ...filters, categoryId: child.id })}
                >
                  {child.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Tầm giá</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Từ"
            className="h-8"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            min={0}
            placeholder="Đến"
            className="h-8"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Ngày tạo</h3>
        <div className="space-y-1.5">
          <Label htmlFor="fromDate" className="text-xs text-muted-foreground">
            Từ ngày
          </Label>
          <Input
            id="fromDate"
            type="date"
            className="h-8"
            value={filters.fromDate ?? ""}
            onChange={(e) => onChange({ ...filters, fromDate: e.target.value || undefined })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="toDate" className="text-xs text-muted-foreground">
            Đến ngày
          </Label>
          <Input
            id="toDate"
            type="date"
            className="h-8"
            value={filters.toDate ?? ""}
            onChange={(e) => onChange({ ...filters, toDate: e.target.value || undefined })}
          />
        </div>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={onReset}>
        Xóa bộ lọc
      </Button>
    </aside>
  );
}
