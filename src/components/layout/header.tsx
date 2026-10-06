"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Search,
  ShoppingCart,
  User as UserIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationItem } from "@/components/notification/notification-item";
import { useLogout } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useMarkNotificationRead, useNotifications, useNotificationWatcher } from "@/hooks/use-notifications";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const itemCount = useCartStore((s) => s.itemCount);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const logout = useLogout();

  useCart();
  useNotificationWatcher();
  const { data: recentNotifications } = useNotifications({ page: 1, pageSize: 5 });
  const markRead = useMarkNotificationRead();
  const unreadCount = recentNotifications?.items.filter((n) => !n.isRead).length ?? 0;

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(search.trim() ? `/?search=${encodeURIComponent(search.trim())}` : "/");
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-primary text-primary-foreground shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          Shopee<span className="font-light">Mini</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="hidden flex-1 items-center sm:flex">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="h-9 border-none bg-background pl-9 text-foreground"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1.5">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "relative text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                )}
              >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full bg-white p-0 text-[10px] text-primary">
                    {unreadCount}
                  </Badge>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="max-h-80 space-y-2 overflow-y-auto p-1">
                  {!recentNotifications || recentNotifications.items.length === 0 ? (
                    <p className="p-3 text-center text-sm text-muted-foreground">Chưa có thông báo</p>
                  ) : (
                    recentNotifications.items.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onMarkRead={(id) => markRead.mutate(id)}
                      />
                    ))
                  )}
                </div>
                <DropdownMenuSeparator />
                <Link href="/notifications" className="block px-2 py-1.5 text-center text-sm text-primary hover:underline">
                  Xem tất cả
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user?.role === "User" && (
            <Link
              href="/cart"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              )}
            >
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full bg-white p-0 text-[10px] text-primary">
                  {itemCount}
                </Badge>
              )}
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-1.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                )}
              >
                <UserIcon className="size-4" />
                <span className="hidden max-w-32 truncate sm:inline">{user.fullName}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <UserIcon /> Hồ sơ của tôi
                </DropdownMenuItem>
                {user.role === "User" && (
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    <ListOrdered /> Đơn hàng của tôi
                  </DropdownMenuItem>
                )}
                {user.role === "Admin" && (
                  <DropdownMenuItem onClick={() => router.push("/admin/products")}>
                    <LayoutDashboard /> Quản lý shop
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => logout.mutate()}>
                  <LogOut /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "hidden text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:inline-flex"
                )}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSearchSubmit} className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="h-9 border-none bg-background pl-9 text-foreground"
          />
        </div>
      </form>
    </header>
  );
}
