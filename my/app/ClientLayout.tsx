"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../lib/store";
import Sidebar from "./Sidebar";
import { Toaster, toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

function SessionExpiredModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mt-4">
            Сессия истекла
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Ваша сессия была автоматически завершена из-за неактивности.
              Пожалуйста, войдите снова.
            </p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none transition-colors"
              onClick={onClose}
            >
              Перейти на главную
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isLoading, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Используем useRef для хранения времени последней активности
  const lastActivityRef = useRef(Date.now());
  const warningShownRef = useRef(false);
  const activityCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Проверка сессии при загрузке
  useEffect(() => {
    console.log("ClientLayout mounting, calling checkAuth");
    checkAuth().finally(() => {
      setSessionChecked(true);
      lastActivityRef.current = Date.now();
    });
  }, [checkAuth]);

  // Проверка причины выхода при загрузке
  useEffect(() => {
    const logoutReason = sessionStorage.getItem("logout_reason");
    if (logoutReason === "session_expired") {
      setShowSessionModal(true);
      toast.error("Сессия истекла. Пожалуйста, войдите снова.");
    }
    // Очищаем причину выхода после проверки
    sessionStorage.removeItem("logout_reason");
  }, []);

  // Отслеживание активности пользователя с обновлением времени
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      warningShownRef.current = false; // Сбрасываем флаг предупреждения при активности
    };

    // События для отслеживания активности
    const events = ["click", "mousemove", "keypress", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated]);

  // Проверка активности каждую минуту
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkActivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      const thirtyMinutes = 30 * 60 * 1000; // 30 минут
      const oneMinute = 60 * 1000; // 1 минута

      console.log(
        `Time since last activity: ${Math.round(
          timeSinceLastActivity / 1000 / 60
        )} minutes`
      );

      // Если прошло больше 30 минут И пользователь неактивен больше 1 минуты
      if (
        timeSinceLastActivity > thirtyMinutes &&
        now - lastActivityRef.current > oneMinute
      ) {
        console.log("Session timeout detected! Logging out...");
        logout(true); // true = сессия истекла
      }
      // Если прошло 29 минут, показываем предупреждение (если еще не показывали)
      else if (
        timeSinceLastActivity > 29 * 60 * 1000 &&
        !warningShownRef.current
      ) {
        console.log("Showing session warning");
        toast.error(
          "Сессия скоро истечет. Пожалуйста, сохраните вашу работу.",
          {
            duration: 10000,
            icon: "⚠️",
          }
        );
        warningShownRef.current = true;
      }
    };

    // Проверяем каждую минуту
    activityCheckRef.current = setInterval(checkActivity, 60000);

    return () => {
      if (activityCheckRef.current) {
        clearInterval(activityCheckRef.current);
      }
    };
  }, [isAuthenticated, logout]);

  // Проверка редиректов
  useEffect(() => {
    if (!sessionChecked || isLoading) return;

    if (
      !isAuthenticated &&
      pathname !== "/" &&
      !pathname.startsWith("/users/auth")
    ) {
      console.log("User not authenticated, checking redirect reason");

      const logoutReason = sessionStorage.getItem("logout_reason");
      const wasAuthenticated = sessionStorage.getItem("was_authenticated");

      if (logoutReason === "session_expired" && wasAuthenticated === "true") {
        // Показываем модалку только если сессия истекла
        setShowSessionModal(true);
        toast.error("Сессия истекла. Пожалуйста, войдите снова.");
      } else {
        // Просто редирект без модалки
        router.push("/");
      }

      sessionStorage.removeItem("logout_reason");
      sessionStorage.removeItem("was_authenticated");
    } else if (isAuthenticated) {
      sessionStorage.setItem("was_authenticated", "true");
    }
  }, [isLoading, isAuthenticated, sessionChecked, router, pathname]);

  const handleSessionModalClose = () => {
    setShowSessionModal(false);
    router.push("/");
  };

  // Очистка интервала при размонтировании
  useEffect(() => {
    return () => {
      if (activityCheckRef.current) {
        clearInterval(activityCheckRef.current);
      }
    };
  }, []);

  if (!sessionChecked || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {isAuthenticated && <Sidebar />}

      <main
        className={`${
          isAuthenticated ? "lg:ml-64" : ""
        } p-4 w-full mt-16 lg:mt-0`}
      >
        {children}

        <SessionExpiredModal
          isOpen={showSessionModal}
          onClose={handleSessionModalClose}
        />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
          }}
        />
      </main>
    </>
  );
}
