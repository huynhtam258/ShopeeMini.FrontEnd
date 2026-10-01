"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { PaginationControl } from "@/components/common/pagination-control";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { OrderDetailDialog } from "@/components/order/order-detail-dialog";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderStatus } from "@/types";

const PAGE_SIZE = 10;
const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "Pending", label: "Đang xử lý" },
  { value: "Paid", label: "Hoàn thành" },
  { value: "Failed", label: "Thất bại" },
  { value: "Cancelled", label: "Đã hủy" },
];

function OrdersContent() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data, isLoading } = useOrders({
    page,
    pageSize: PAGE_SIZE,
    status: status === "all" ? undefined : status,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Đơn hàng của tôi</h1>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Trạng thái</Label>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as OrderStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Từ ngày</Label>
          <Input
            type="date"
            className="h-9"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Đến ngày</Label>
          <Input
            type="date"
            className="h-9"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {!isLoading && (!data || data.items.length === 0) ? (
        <EmptyState icon={ListOrdered} title="Chưa có đơn hàng nào" description="Đơn hàng bạn đặt sẽ hiển thị tại đây." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Số lượng SP</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.map((order) => (
                <TableRow
                  key={order.id}
                  className={order.id === Number(highlight) ? "bg-primary/5" : undefined}
                >
                  <TableCell className="font-medium">{order.orderCode}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.itemCount}</TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrderId(order.id)}>
                      <Eye className="size-4" />
                      Xem hóa đơn
                    </Button>
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

      <OrderDetailDialog orderId={selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)} />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
