"use client";

import { useState, useEffect, useRef } from "react";
import { getPrinters } from "../../lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import AuthGuard from "../AuthGuard";
import Link from "next/link";

interface Printer {
  id: number;
  name: string;
  type: string;
  quantity_material: number;
  user_id: number;
  username: string;
  warning?: string;
}

export default function Printers() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [warnings, setWarnings] = useState<string[]>([]);
  const hasShownCriticalToast = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await getPrinters();
        const printersData = response.data || [];

        console.log("Данные принтеров с бэкенда:", printersData);
        printersData.forEach((printer: Printer, index: number) => {
          console.log(`Принтер ${index + 1}:`, {
            id: printer.id,
            name: printer.name,
            quantity: printer.quantity_material,
            warning: printer.warning,
            hasWarning: !!printer.warning,
          });
        });

        setPrinters(printersData);

        const criticalWarnings: string[] = [];
        const allWarnings: string[] = [];

        printersData.forEach((printer: Printer) => {
          if (printer.quantity_material === 0) {
            const criticalWarning = `КРИТИЧЕСКИ: в принтере "${printer.name}" закончился материал!`;
            criticalWarnings.push(criticalWarning);
            allWarnings.push(criticalWarning);
          } else if (printer.warning) {
            criticalWarnings.push(printer.warning);
            allWarnings.push(printer.warning);
          }

          if (printer.quantity_material > 0 && printer.quantity_material < 10) {
            allWarnings.push(
              `Внимание: в принтере "${printer.name}" осталось мало материала (${printer.quantity_material} г/мл)!`
            );
          }
        });

        console.log(
          "Критические предупреждения (для toast):",
          criticalWarnings
        );
        console.log("Все предупреждения (для страницы):", allWarnings);
        setWarnings(allWarnings);

        if (criticalWarnings.length > 0 && !hasShownCriticalToast.current) {
          if (criticalWarnings.length === 1) {
            toast.error(criticalWarnings[0], {
              duration: 6000,
            });
          } else {
            toast.error(
              `${criticalWarnings.length} критических проблем с принтерами!`,
              {
                duration: 8000,
              }
            );
          }
          hasShownCriticalToast.current = true;
        }
      } catch (err: any) {
        console.error("Ошибка загрузки данных:", err.message);
        toast.error("Ошибка при загрузке принтеров");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const getPrinterStatus = (printer: Printer) => {
    if (printer.quantity_material === 0) {
      return {
        status: "critical",
        text: "Закончился",
        class: "bg-red-100 text-red-800",
        warningText: "КРИТИЧЕСКИ: материал закончился!",
      };
    }
    if (printer.quantity_material < 10) {
      return {
        status: "low",
        text: "Мало",
        class: "bg-yellow-100 text-yellow-800",
        warningText: `Мало материала: ${printer.quantity_material} г/мл`,
      };
    }
    if (printer.warning) {
      return {
        status: "critical",
        text: "Критично",
        class: "bg-red-100 text-red-800",
        warningText: printer.warning,
      };
    }
    return {
      status: "normal",
      text: "Норма",
      class: "bg-green-100 text-green-800",
      warningText: "Нет уведомлений",
    };
  };

  // Функция для получения стилей типа принтера
  const getPrinterTypeStyles = (type: string) => {
    return type === "plastic"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  const criticalWarnings = warnings.filter(
    (warning) => warning.includes("КРИТИЧЕСКИ") || warning.includes("критич")
  );
  const lowWarnings = warnings.filter(
    (warning) => warning.includes("Внимание") || warning.includes("мало")
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
          Список принтеров
        </h1>

        {criticalWarnings.length > 0 && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Критические проблемы:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {criticalWarnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {lowWarnings.length > 0 && (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Низкий запас материала:
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      {lowWarnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          {printers.length > 0 ? (
            <>
              {/* Таблица для десктопа */}
              <div className="desktop-only overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Название</th>
                      <th className="px-4 py-2 text-left">Тип</th>
                      <th className="px-4 py-2 text-left">
                        Количество материала
                      </th>
                      <th className="px-4 py-2 text-left">Пользователь</th>
                      <th className="px-4 py-2 text-left">Статус</th>
                      <th className="px-4 py-2 text-left">Уведомления</th>
                      <th className="px-4 py-2 text-left">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printers.map((printer) => {
                      const status = getPrinterStatus(printer);
                      const typeStyles = getPrinterTypeStyles(printer.type);
                      return (
                        <tr
                          key={printer.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-2">{printer.id}</td>
                          <td className="px-4 py-2 font-medium">
                            {printer.name}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles}`}
                            >
                              {printer.type === "plastic" ? "Пластик" : "Смола"}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={
                                printer.quantity_material === 0
                                  ? "text-red-600 font-semibold"
                                  : printer.quantity_material < 10
                                  ? "text-yellow-600 font-semibold"
                                  : "text-gray-800"
                              }
                            >
                              {printer.quantity_material} г/мл
                              {printer.quantity_material === 0 && (
                                <span className="ml-1 text-xs text-red-500">
                                  (ПУСТО)
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-2">{printer.username}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}
                            >
                              {status.text}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={
                                status.status === "critical"
                                  ? "text-red-600 text-sm font-medium"
                                  : status.status === "low"
                                  ? "text-yellow-600 text-sm"
                                  : "text-green-600 text-sm"
                              }
                            >
                              {status.warningText}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <Link
                              href={`/printers/${printer.id}/edit`}
                              className="text-cyan-600 hover:underline font-medium"
                            >
                              Редактировать
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Карточки для мобилки */}
              <div className="mobile-only space-y-3">
                {printers.map((printer) => {
                  const status = getPrinterStatus(printer);
                  const typeStyles = getPrinterTypeStyles(printer.type);
                  return (
                    <div key={printer.id} className="table-card">
                      <div className="table-card-header">
                        {printer.name} (ID: {printer.id})
                      </div>
                      <div className="table-card-row">
                        <span className="table-card-label">Тип:</span>
                        <span
                          className={`table-card-value inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles}`}
                        >
                          {printer.type === "plastic" ? "Пластик" : "Смола"}
                        </span>
                      </div>
                      <div className="table-card-row">
                        <span className="table-card-label">Материал:</span>
                        <span
                          className={`table-card-value ${
                            printer.quantity_material === 0
                              ? "text-red-600 font-semibold"
                              : printer.quantity_material < 10
                              ? "text-yellow-600 font-semibold"
                              : "text-gray-800"
                          }`}
                        >
                          {printer.quantity_material} г/мл
                          {printer.quantity_material === 0 && (
                            <span className="ml-1 text-xs text-red-500">
                              (ПУСТО)
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="table-card-row">
                        <span className="table-card-label">Пользователь:</span>
                        <span className="table-card-value">
                          {printer.username}
                        </span>
                      </div>
                      <div className="table-card-row">
                        <span className="table-card-label">Статус:</span>
                        <span
                          className={`table-card-value inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <div className="table-card-row">
                        <span className="table-card-label">Уведомления:</span>
                        <span
                          className={`table-card-value ${
                            status.status === "critical"
                              ? "text-red-600 font-medium"
                              : status.status === "low"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {status.warningText}
                        </span>
                      </div>
                      <div className="table-card-row">
                        <span className="table-card-label">Действия:</span>
                        <Link
                          href={`/printers/${printer.id}/edit`}
                          className="table-card-value text-cyan-600 hover:underline font-medium"
                        >
                          Редактировать
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {printers.length}
                  </div>
                  <div className="text-sm text-blue-800">Всего принтеров</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {printers.filter((p) => p.quantity_material >= 10).length}
                  </div>
                  <div className="text-sm text-green-800">Норма</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      printers.filter(
                        (p) =>
                          p.quantity_material > 0 && p.quantity_material < 10
                      ).length
                    }
                  </div>
                  <div className="text-sm text-yellow-800">Мало</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {printers.filter((p) => p.quantity_material === 0).length}
                  </div>
                  <div className="text-sm text-red-800">Пусто</div>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/printers/create" className="btn btn-primary">
                  Добавить принтер
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl lg:text-6xl mb-4">🖨️</div>
              <p className="text-gray-500 text-lg mb-2">Нет принтеров</p>
              <Link
                href="/printers/create"
                className="text-cyan-600 hover:underline"
              >
                Добавить новый принтер
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
