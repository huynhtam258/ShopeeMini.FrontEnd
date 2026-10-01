"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ListOrdered, LogOut, PackageSearch, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";

const NAV_ITEMS = [
  { href: "/admin/products", label: "Sản phẩm", icon: PackageSearch },
  { href: "/admin/orders", label: "Đơn hàng", icon: ListOrdered },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-card">
      <div className="flex items-center gap-2 border-b px-5 py-4">
        <Store className="size-5 text-primary" />
        <div>
          <p className="text-sm font-bold leading-none">ShopeeMini</p>
          <p className="text-xs text-muted-foreground">Kênh người bán</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LayoutGrid className="size-4" />
          Về trang chủ
        </Link>
      </nav>

      <div className="border-t p-3">
        <div className="mb-2 px-2">
          <p className="truncate text-sm font-medium">{user?.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
