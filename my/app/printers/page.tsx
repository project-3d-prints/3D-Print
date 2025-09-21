"use client";

import { useState, useEffect } from "react";
import { getPrinters } from "../../lib/api";
import AuthGuard from "../AuthGuard";
import LoadingSpinner from "../LoadingSpinner";
import Link from "next/link";

export default function ListPrinters() {
  const [printers, setPrinters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPrinters() {
      try {
        const response = await getPrinters();
        setPrinters(response.data || []);
      } catch (err) {
        console.error("Error fetching printers:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrinters();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Загружаем принтеры..." />;
  }

  return (
    <AuthGuard requiredRole="глава лаборатории">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-cyan-700">
            Список принтеров
          </h1>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-3 py-2 text-left text-sm font-medium text-cyan-700">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-cyan-700">
                    Название
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-cyan-700">
                    Статус
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-cyan-700">
                    Владелец
                  </th>
                </tr>
              </thead>
              <tbody>
                {printers.map((printer: any) => (
                  <tr key={printer.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{printer.id}</td>
                    <td className="px-3 py-2 text-sm font-medium">
                      {printer.name}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          printer.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {printer.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {printer.username || printer.owner || "Неизвестно"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {printers.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl lg:text-6xl mb-4">🖨️</div>
              <p className="text-gray-500 text-lg mb-2">Нет принтеров</p>
              <Link href="/printers/create" className="btn btn-primary text-sm">
                Добавить первый принтер
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
