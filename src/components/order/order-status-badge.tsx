import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL, OrderStatus } from "@/types";

const STATUS_CLASS: Record<OrderStatus, string> = {
  Pending: "bg-warning/20 text-warning-foreground border-warning/40",
  Paid: "bg-success/15 text-success border-success/30",
  Failed: "bg-destructive/10 text-destructive border-destructive/30",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATUS_CLASS[status])}>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}
