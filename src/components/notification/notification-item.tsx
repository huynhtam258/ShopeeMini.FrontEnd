"use client";

import { Bell, PackageX, ShoppingBag, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { NotificationDto } from "@/types";

const ICON_MAP: Record<NotificationDto["type"], React.ElementType> = {
  OrderPlacedSuccess: ShoppingBag,
  OrderPlacedFailed: XCircle,
  NewOrderForShop: Bell,
  ProductHiddenRemovedFromCart: PackageX,
};

interface NotificationItemProps {
  notification: NotificationDto;
  onMarkRead?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const Icon = ICON_MAP[notification.type] ?? Bell;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4 transition-colors",
        !notification.isRead && "border-primary/30 bg-primary/5"
      )}
      onClick={() => !notification.isRead && onMarkRead?.(notification.id)}
      role={onMarkRead ? "button" : undefined}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          notification.type === "ProductHiddenRemovedFromCart" || notification.type === "OrderPlacedFailed"
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="size-4.5" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{notification.title}</p>
          {!notification.isRead && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(notification.createdAt)}</p>
      </div>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}
