"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["Admin"]}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden bg-muted/30 p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
