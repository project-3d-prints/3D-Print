"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../lib/store";
import Image from "next/image";

export default function Sidebar() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: "/dashboard",
      label: "Главная",
      icon: "/img/star2.svg",
      iconActive: "/img/star.svg",
    },
    {
      href: "/printers/create",
      label: "Добавить принтер",
      icon: "/img/printer.svg",
      iconActive: "/img/printer2.svg",
    },
    {
      href: "/printers",
      label: "Список принтеров",
      icon: "/img/list.svg",
      iconActive: "/img/list2.svg",
    },
    {
      href: "/materials/create",
      label: "Добавить материал",
      icon: "/img/flask.svg",
      iconActive: "/img/flask2.svg",
    },
    {
      href: "/materials",
      label: "Список материалов",
      icon: "/img/material.svg",
      iconActive: "/img/material2.svg",
    },
    {
      href: "/jobs/create",
      label: "Создать заявку",
      icon: "/img/add.svg",
      iconActive: "/img/add2.svg",
    },
    {
      href: "/jobs/queue/0",
      label: "Список заявок",
      icon: "/img/queue.svg",
      iconActive: "/img/queue2.svg",
    },
  ];

  const handleLogout = () => {
    clearAuth();
    document.cookie = "session_id=; Max-Age=0; path=/";
    router.push("/users/auth/login");
  };

  const handleUnauthorizedClick = () => {
    alert("Пожалуйста, войдите в аккаунт, чтобы продолжить.");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-cyan-700 text-cyan-50 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">ЗD Print</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <div key={item.href}>
            {isAuthenticated ? (
              <Link
                href={item.href}
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors duration-200 hover:bg-cyan-50 hover:text-cyan-700 group ${
                  pathname === item.href ? "bg-cyan-50 text-cyan-700" : ""
                }`}
              >
                <div className="relative w-5 h-5">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={`w-5 h-5 transition-opacity duration-200 ${
                      pathname === item.href ? "opacity-0" : "opacity-100"
                    } group-hover:opacity-0`}
                  />
                  <Image
                    src={item.iconActive}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={`absolute top-0 left-0 w-5 h-5 transition-opacity duration-200 ${
                      pathname === item.href ? "opacity-100" : "opacity-0"
                    } group-hover:opacity-100`}
                  />
                </div>
                <span>{item.label}</span>
              </Link>
            ) : (
              <div
                className="flex items-center space-x-2 p-2 rounded-md cursor-not-allowed"
                onClick={handleUnauthorizedClick}
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
                <span className="text-cyan-50">{item.label}</span>{" "}
                {/* Изменён цвет на белый */}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="absolute bottom-4 w-full px-4">
        {isAuthenticated ? (
          <div className="flex flex-col items-center justify-between">
            <span className="mb-2">
              {user?.username || "Неизвестный пользователь"}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm hover:underline w-full text-center decoration-none cursor-pointer text-red-200 hover:text-red-100"
            >
              Выйти из аккаунта
            </button>
          </div>
        ) : (
          <Link
            href="/users/auth/login"
            className="block cursor-pointer decoration-none text-cyan-200 hover:text-cyan-100"
          >
            Войти
          </Link>
        )}
      </div>
    </aside>
  );
}
