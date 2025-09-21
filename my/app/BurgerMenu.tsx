// app/BurgerMenu.tsx
"use client";

import { useAuthStore } from "../lib/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: "/dashboard",
      label: "Главная",
      icon: "/img/star2.svg",
      iconActive: "/img/star.svg",
      allowedRoles: ["глава лаборатории", "учитель", "студент"],
    },
    {
      href: "/printers/create",
      label: "Добавить принтер",
      icon: "/img/printer.svg",
      iconActive: "/img/printer2.svg",
      allowedRoles: ["глава лаборатории"],
    },
    {
      href: "/printers",
      label: "Список принтеров",
      icon: "/img/list.svg",
      iconActive: "/img/list2.svg",
      allowedRoles: ["глава лаборатории"],
    },
    {
      href: "/materials/create",
      label: "Добавить материал",
      icon: "/img/flask.svg",
      iconActive: "/img/flask2.svg",
      allowedRoles: ["глава лаборатории"],
    },
    {
      href: "/materials",
      label: "Список материалов",
      icon: "/img/material.svg",
      iconActive: "/img/material2.svg",
      allowedRoles: ["глава лаборатории"],
    },
    {
      href: "/jobs/create",
      label: "Создать заявку",
      icon: "/img/add.svg",
      iconActive: "/img/add2.svg",
      allowedRoles: ["глава лаборатории", "учитель", "студент"],
    },
    {
      href: "/jobs/queue/0",
      label: "Список заявок",
      icon: "/img/queue.svg",
      iconActive: "/img/queue2.svg",
      allowedRoles: ["глава лаборатории", "учитель", "студент"],
    },
    {
      href: "/admin",
      label: "Админ-панель",
      icon: "/img/men.svg",
      iconActive: "/img/men2.svg",
      allowedRoles: ["глава лаборатории"],
    },
  ];

  const hasAccess = (allowedRoles: string[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const handleLogout = () => {
    clearAuth();
    document.cookie = "session_id=; Max-Age=0; path=/";
    router.push("/users/auth/login");
    onClose();
  };

  const handleForbiddenClick = (itemLabel: string) => {
    alert(`У вас недостаточно прав для доступа к "${itemLabel}".`);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 lg:hidden bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed left-0 top-0 z-50 lg:hidden h-full w-80 bg-cyan-800 text-white p-4 overflow-y-auto transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">3D Print</h1>
          <button
            onClick={onClose}
            className="text-2xl hover:text-cyan-200 transition-colors"
          >
            ×
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const userHasAccess = hasAccess(item.allowedRoles);
            const isActive = pathname === item.href;

            return (
              <div key={item.href}>
                {isAuthenticated ? (
                  userHasAccess ? (
                    <Link
                      href={item.href}
                      className="group flex items-center space-x-3 p-3 rounded-md transition-all duration-200 hover:bg-white hover:text-cyan-800"
                      onClick={onClose}
                    >
                      <div className="relative w-6 h-6">
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={24}
                          height={24}
                          className="w-6 h-6 transition-opacity duration-200 group-hover:opacity-0"
                        />
                        <Image
                          src={item.iconActive}
                          alt={item.label}
                          width={24}
                          height={24}
                          className="absolute top-0 left-0 w-6 h-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        />
                      </div>
                      <span className="transition-colors group-hover:text-cyan-800">
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <div
                      className="flex items-center space-x-3 p-3 rounded-md opacity-50 transition-opacity hover:opacity-70"
                      onClick={() => handleForbiddenClick(item.label)}
                      title="Недостаточно прав"
                      style={{ cursor: "url('/img/lock.png') 16 16, auto" }}
                    >
                      <div className="relative w-6 h-6">
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </div>
                      <span>{item.label}</span>
                    </div>
                  )
                ) : (
                  <div
                    className="flex items-center space-x-3 p-3 rounded-md cursor-not-allowed opacity-50"
                    onClick={() => alert("Пожалуйста, войдите в аккаунт")}
                  >
                    <div className="relative w-6 h-6">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <span>{item.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          {isAuthenticated ? (
            <div className="flex flex-col items-center justify-between">
              <span className="mb-2 text-sm">
                {user?.username || "Неизвестный пользователь"}
              </span>
              <span className="mb-2 text-xs text-cyan-300">
                Роль: {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm hover:underline w-full text-center text-white hover:text-cyan-200 transition-colors"
              >
                Выйти из аккаунта
              </button>
            </div>
          ) : (
            <Link
              href="/users/auth/login"
              className="block text-center text-cyan-200 hover:text-cyan-100 transition-colors"
              onClick={onClose}
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
