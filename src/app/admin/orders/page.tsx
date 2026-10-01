"use client";

import { useState } from "react";
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
import { useAdminOrders } from "@/hooks/use-orders";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { OrderStatus } from "@/types";

const PAGE_SIZE = 10;
const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "Pending", label: "Đang xử lý" },
  { value: "Paid", label: "Hoàn thành" },
  { value: "Failed", label: "Thất bại" },
  { value: "Cancelled", label: "Đã hủy" },
];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, isLoading } = useAdminOrders({
    page,
    pageSize: PAGE_SIZE,
    status: status === "all" ? undefined : status,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Đơn hàng của cửa hàng</h1>

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
        <EmptyState title="Chưa có đơn hàng nào" description="Đơn hàng của khách sẽ hiển thị tại đây." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>SL</TableHead>
                <TableHead>Thành tiền</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.map((line, idx) => (
                <TableRow key={`${line.orderId}-${idx}`}>
                  <TableCell className="font-medium">{line.orderCode}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{line.buyerName}</p>
                      <p className="text-xs text-muted-foreground">{line.buyerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-48 truncate text-sm">{line.productName}</p>
                    <p className="text-xs text-muted-foreground">{line.variantName}</p>
                  </TableCell>
                  <TableCell>{line.quantity}</TableCell>
                  <TableCell>{formatCurrency(line.lineTotal)}</TableCell>
                  <TableCell>{formatDateTime(line.createdAt)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={line.orderStatus} />
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
    </div>
  );
}
