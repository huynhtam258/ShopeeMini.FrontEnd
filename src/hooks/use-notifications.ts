"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/lib/api/notification.service";
import { getApiErrorMessage } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth.store";
import { NotificationQuery } from "@/types";

const POLL_INTERVAL_MS = 20_000;

export function useNotifications(query: NotificationQuery) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: queryKeys.notifications(query),
    queryFn: () => notificationService.list(query),
    enabled: !!accessToken,
    placeholderData: (prev) => prev,
    refetchInterval: POLL_INTERVAL_MS,
  });
}

/** Polls unread notifications in the background and toasts newly arrived ones. */
export function useNotificationWatcher() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const seenIds = useRef<Set<number> | null>(null);

  const query = useQuery({
    queryKey: queryKeys.notifications({ isRead: false, page: 1, pageSize: 10 }),
    queryFn: () => notificationService.list({ isRead: false, page: 1, pageSize: 10 }),
    enabled: !!accessToken,
    refetchInterval: POLL_INTERVAL_MS,
  });

  useEffect(() => {
    if (!query.data) return;
    const currentIds = new Set(query.data.items.map((n) => n.id));

    if (seenIds.current === null) {
      seenIds.current = currentIds;
      return;
    }

    const newOnes = query.data.items.filter((n) => !seenIds.current!.has(n.id));
    if (newOnes.length > 0) {
      newOnes.forEach((n) => {
        toast(n.title, { description: n.message });
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
    seenIds.current = currentIds;
  }, [query.data, queryClient]);

  return query.data?.totalCount ?? 0;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Không thể đánh dấu đã đọc.")),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.remove(id),
    onSuccess: (message) => {
      toast.success(message ?? "Đã xóa thông báo.");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Xóa thông báo thất bại.")),
  });
}
