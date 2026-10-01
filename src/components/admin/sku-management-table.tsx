"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddSkuDialog } from "@/components/admin/add-sku-dialog";
import { CreateDiscountDialog } from "@/components/admin/create-discount-dialog";
import { EditSkuDialog } from "@/components/admin/edit-sku-dialog";
import { formatCurrency } from "@/lib/format";
import { SkuDto } from "@/types";

export function SkuManagementTable({ productId, skus }: { productId: number; skus: SkuDto[] }) {
  const [editingSku, setEditingSku] = useState<SkuDto | null>(null);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Biến thể</TableHead>
              <TableHead>Mã SKU</TableHead>
              <TableHead>Giá bán</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skus.map((sku) => (
              <TableRow key={sku.id}>
                <TableCell className="font-medium">{sku.variantName}</TableCell>
                <TableCell className="text-muted-foreground">{sku.skuCode}</TableCell>
                <TableCell>
                  {formatCurrency(sku.price)}
                  {sku.activeDiscountPercent > 0 && (
                    <span className="ml-1 text-xs text-primary">
                      → {formatCurrency(sku.effectivePrice)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {sku.stockQuantity <= 0 ? (
                    <Badge variant="destructive">Hết hàng</Badge>
                  ) : (
                    sku.stockQuantity
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    {sku.activeDiscountPercent > 0 && (
                      <Badge className="bg-primary text-primary-foreground">
                        -{sku.activeDiscountPercent}%
                      </Badge>
                    )}
                    <CreateDiscountDialog sku={sku} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setEditingSku(sku)}>
                    <Pencil className="size-3.5" />
                    Sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddSkuDialog productId={productId} />
      <EditSkuDialog sku={editingSku} onOpenChange={(open) => !open && setEditingSku(null)} />
    </div>
  );
}
