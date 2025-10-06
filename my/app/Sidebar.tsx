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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  console.log("Sidebar user state:", { user, isAuthenticated });

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
    // Закомментированный элемент админ-панели
    // {
    //   href: "/admin",
    //   label: "Админ-панель",
    //   icon: "/img/men.svg",
    //   iconActive: "/img/men2.svg",
    //   allowedRoles: ["глава лаборатории"],
    // },
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-cyan-700 text-white rounded-md"
        onClick={() => setIsBurgerOpen(true)}
      >
        ☰
      </button>

      <aside
        className={`hidden lg:block fixed top-0 left-0 h-screen bg-cyan-700 text-cyan-50 p-4 transition-all duration-300 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold">ЗD Print</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-cyan-600 transition-colors"
            title={isSidebarCollapsed ? "Развернуть" : "Свернуть"}
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isSidebarCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isSidebarCollapsed ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
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
                      className={`flex items-center p-2 rounded-md transition-colors duration-200 hover:bg-cyan-50 hover:text-cyan-700 group ${
                        isActive ? "bg-cyan-50 text-cyan-700" : ""
                      } ${isSidebarCollapsed ? "justify-center" : ""}`}
                      title={isSidebarCollapsed ? item.label : ""}
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
                      {!isSidebarCollapsed && (
                        <span className="ml-2">{item.label}</span>
                      )}
                    </Link>
                  ) : (
                    <div
                      className={`flex items-center p-2 rounded-md opacity-50 ${
                        isSidebarCollapsed ? "justify-center" : ""
                      }`}
                      onClick={() => handleForbiddenClick(item.label)}
                      title={
                        isSidebarCollapsed ? item.label : "Недостаточно прав"
                      }
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
                      {!isSidebarCollapsed && (
                        <span className="ml-2">{item.label}</span>
                      )}
                    </div>
                  )
                ) : (
                  <div
                    className={`flex items-center p-2 rounded-md cursor-not-allowed ${
                      isSidebarCollapsed ? "justify-center" : ""
                    }`}
                    onClick={() => alert("Пожалуйста, войдите в аккаунт")}
                    title={isSidebarCollapsed ? item.label : ""}
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
                    {!isSidebarCollapsed && (
                      <span className="ml-2">{item.label}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div
          className={`absolute bottom-4 left-0 right-0 px-4 ${
            isSidebarCollapsed ? "text-center" : ""
          }`}
        >
          {isAuthenticated ? (
            <div
              className={`flex flex-col ${
                isSidebarCollapsed ? "items-center" : "items-start"
              }`}
            >
              {!isSidebarCollapsed && (
                <>
                  <span className="mb-1 text-sm text-center w-full">
                    {user?.username || "Неизвестный пользователь"}
                  </span>

                  <span className="mb-2 text-xs text-cyan-200 text-center w-full">
                    Роль: {user?.role}
                  </span>
                </>
              )}

              <button
                onClick={handleLogout}
                className={`text-sm hover:underline text-white hover:text-cyan-200 ${
                  isSidebarCollapsed ? "w-auto" : "w-full text-center"
                }`}
                title={isSidebarCollapsed ? "Выйти" : ""}
              >
                {isSidebarCollapsed ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                ) : (
                  "Выйти из аккаунта"
                )}
              </button>
            </div>
          ) : (
            <Link
              href="/users/auth/login"
              className={`block text-cyan-200 hover:text-cyan-100 ${
                isSidebarCollapsed ? "text-center" : ""
              }`}
              title={isSidebarCollapsed ? "Войти" : ""}
            >
              {isSidebarCollapsed ? (
                <svg
                  className="w-5 h-5 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              ) : (
                "Войти"
              )}
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
