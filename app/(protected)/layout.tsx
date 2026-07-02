"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@qpub/qui";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
