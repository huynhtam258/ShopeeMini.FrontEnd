"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  /** If provided, only these roles may access the route. */
  allowedRoles?: UserRole[];
  /** Where to send a user whose role doesn't match (defaults to home). */
  redirectTo?: string;
}

function FullPageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export function AuthGuard({ children, allowedRoles, redirectTo = "/" }: AuthGuardProps) {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, user, allowedRoles, redirectTo, router]);

  if (!hasHydrated || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
