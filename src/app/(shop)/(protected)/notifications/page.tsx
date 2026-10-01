"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/empty-state";
import { PaginationControl } from "@/components/common/pagination-control";
import { NotificationItem } from "@/components/notification/notification-item";
import {
  useDeleteNotification,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/use-notifications";

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const { data, isLoading } = useNotifications({
    page,
    pageSize: PAGE_SIZE,
    isRead: tab === "unread" ? false : undefined,
  });

  const markRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-lg font-semibold">Trung tâm thông báo</h1>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as "all" | "unread");
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
        </TabsList>
      </Tabs>

      {!isLoading && (!data || data.items.length === 0) && (
        <EmptyState icon={Bell} title="Không có thông báo nào" />
      )}

      <div className="space-y-2">
        {data?.items.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={(id) => markRead.mutate(id)}
            onDelete={(id) => deleteNotification.mutate(id)}
          />
        ))}
      </div>

      {data && (
        <div className="flex justify-center pt-2">
          <PaginationControl page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
