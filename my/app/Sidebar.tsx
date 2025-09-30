// app/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../lib/store";
import Image from "next/image";
import { useState } from "react";
import BurgerMenu from "./BurgerMenu";

export default function Sidebar() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

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
  };

  const handleForbiddenClick = (itemLabel: string) => {
    alert(`У вас недостаточно прав для доступа к "${itemLabel}".`);
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-cyan-700 text-white rounded-md"
        onClick={() => setIsBurgerOpen(true)}
      >
        ☰
      </button>

      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-64 bg-cyan-700 text-cyan-50 p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">ЗD Print</h1>
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
                      className={`flex items-center space-x-2 p-2 rounded-md transition-colors duration-200 hover:bg-cyan-50 hover:text-cyan-700 group ${
                        isActive ? "bg-cyan-50 text-cyan-700" : ""
                      }`}
                    >
                      <div className="relative w-5 h-5">
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={`w-5 h-5 transition-opacity duration-200 ${
                            isActive ? "opacity-0" : "opacity-100"
                          } group-hover:opacity-0`}
                        />
                        <Image
                          src={item.iconActive}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={`absolute top-0 left-0 w-5 h-5 transition-opacity duration-200 ${
                            isActive ? "opacity-100" : "opacity-0"
                          } group-hover:opacity-100`}
                        />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <div
                      className="flex items-center space-x-2 p-2 rounded-md opacity-50"
                      onClick={() => handleForbiddenClick(item.label)}
                      title="Недостаточно прав"
                      style={{ cursor: "url('/img/lock.png') 16 16, auto" }}
                    >
                      <div className="relative w-5 h-5">
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </div>
                      <span>{item.label}</span>
                    </div>
                  )
                ) : (
                  <div
                    className="flex items-center space-x-2 p-2 rounded-md cursor-not-allowed"
                    onClick={() => alert("Пожалуйста, войдите в аккаунт")}
                  >
                    <div className="relative w-5 h-5">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                        className="w-5 h-5"
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
              <span className="mb-2 text-xs text-cyan-200">
                Роль: {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm hover:underline w-full text-center text-white hover:text-cyan-200"
              >
                Выйти из аккаунта
              </button>
            </div>
          ) : (
            <Link
              href="/users/auth/login"
              className="block text-center text-cyan-200 hover:text-cyan-100"
            >
              Войти
            </Link>
          )}
        </div>
      </aside>

      <BurgerMenu
        isOpen={isBurgerOpen}
        onClose={() => setIsBurgerOpen(false)}
      />
    </>
  );
}
