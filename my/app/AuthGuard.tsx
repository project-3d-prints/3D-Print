"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../lib/store";
import { toast } from "react-hot-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, user, isLoading, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Показываем уведомление только если пользователь был авторизован
      const wasAuthenticated = sessionStorage.getItem("was_authenticated");
      if (wasAuthenticated === "true") {
        toast.error("Сессия истекла. Пожалуйста, войдите снова.");
        sessionStorage.removeItem("was_authenticated");
      }
      router.push("/");
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      toast.error("Недостаточно прав для доступа к этой странице");
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, requiredRole, router, isLoading, logout]);

  // Сохраняем статус авторизации при монтировании
  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem("was_authenticated", "true");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
