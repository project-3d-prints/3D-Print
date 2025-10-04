"use client";

import { useState, useEffect } from "react";
import { getPrinters } from "../../lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import AuthGuard from "../AuthGuard";
import Link from "next/link";

export default function Printers() {
  const [printers, setPrinters] = useState<
    {
      id: number;
      name: string;
      type: string;
      quantity_material: number;
      user_id: number;
      username: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await getPrinters();
        setPrinters(response.data || []);
      } catch (err: any) {
        console.error("Ошибка загрузки данных:", err.message);
        toast.error("Ошибка при загрузке принтеров");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
          Список принтеров
        </h1>

        <div className="card">
          {printers.length > 0 ? (
            <>
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Название</th>
                    <th className="px-4 py-2 text-left">Тип</th>
                    <th className="px-4 py-2 text-left">
                      Количество материала (г/мл)
                    </th>
                    <th className="px-4 py-2 text-left">Пользователь</th>
                    <th className="px-4 py-2 text-left">Уведомления</th>
                    <th className="px-4 py-2 text-left">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {printers.map((printer) => (
                    <tr key={printer.id} className="border-b">
                      <td className="px-4 py-2">{printer.id}</td>
                      <td className="px-4 py-2">{printer.name}</td>
                      <td className="px-4 py-2">
                        {printer.type === "plastic" ? "Пластик" : "Смола"}
                      </td>
                      <td className="px-4 py-2">
                        {printer.quantity_material} г/мл
                      </td>
                      <td className="px-4 py-2">{printer.username}</td>
                      <td className="px-4 py-2">
                        {printer.quantity_material < 10 ? (
                          <span className="text-red-600">
                            Низкий уровень материала
                          </span>
                        ) : (
                          <span className="text-green-600">В норме</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/printers/${printer.id}/edit`}
                          className="text-cyan-600 hover:underline"
                        >
                          Редактировать
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
