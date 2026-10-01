"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { PaginationControl } from "@/components/common/pagination-control";
import { useCategories } from "@/hooks/use-categories";
import { useAdminProducts, useSetProductStatus } from "@/hooks/use-products";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [pendingHideId, setPendingHideId] = useState<number | null>(null);

  const { data: categories = [] } = useCategories();
  const { data, isLoading } = useAdminProducts({
    page,
    pageSize: PAGE_SIZE,
    categoryId: categoryId === "all" ? undefined : Number(categoryId),
  });
  const setStatus = useSetProductStatus();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Quản lý sản phẩm</h1>
        <Link href="/admin/products/create" className={cn(buttonVariants(), "gap-1.5")}>
          <Plus className="size-4" />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-lg border p-4">
        <Select
          value={categoryId}
          onValueChange={(v) => {
            if (v) setCategoryId(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isLoading && (!data || data.items.length === 0) ? (
        <EmptyState
          title="Chưa có sản phẩm nào"
          description="Bắt đầu bằng cách thêm sản phẩm đầu tiên cho cửa hàng của bạn."
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Hiển thị</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="max-w-64 truncate font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.categoryName}</Badge>
                  </TableCell>
                  <TableCell>
                    {product.hasActiveDiscount ? (
                      <span>
                        {formatCurrency(product.minEffectivePrice)}
                        <span className="ml-1 text-xs text-muted-foreground line-through">
                          {formatCurrency(product.minPrice)}
                        </span>
                      </span>
                    ) : (
                      formatCurrency(product.minPrice)
                    )}
                  </TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isPublic}
                      disabled={setStatus.isPending}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          setPendingHideId(product.id);
                        } else {
                          setStatus.mutate({ id: product.id, payload: { isPublic: true } });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                    >
                      <Pencil className="size-3.5" />
                      Sửa
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {data && (
        <div className="flex justify-center pt-2">
          <PaginationControl page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        open={pendingHideId !== null}
        onOpenChange={(open) => !open && setPendingHideId(null)}
        title="Ẩn sản phẩm khỏi cửa hàng?"
        description="Sản phẩm sẽ bị xóa khỏi giỏ hàng của tất cả khách hàng đang chứa sản phẩm này và họ sẽ nhận được thông báo."
        confirmText="Ẩn sản phẩm"
        destructive
        loading={setStatus.isPending}
        onConfirm={() => {
          if (pendingHideId === null) return;
          setStatus.mutate(
            { id: pendingHideId, payload: { isPublic: false } },
            { onSuccess: () => setPendingHideId(null) }
          );
        }}
      />
    </div>
  );
}
