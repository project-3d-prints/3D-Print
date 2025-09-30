"use client";

import { useState, useEffect } from "react";
import { getMaterials } from "../../lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import AuthGuard from "../AuthGuard";
import Link from "next/link";

export default function Materials() {
  const [materials, setMaterials] = useState<
    { id: number; name: string; quantity_storage: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await getMaterials();
        setMaterials(response.data || []);
      } catch (err: any) {
        console.error("Ошибка загрузки данных:", err.message);
        toast.error("Ошибка при загрузке материалов");
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800">
            Список материалов
          </h1>
          <Link href="/materials/create" className="btn btn-primary">
            Добавить материал
          </Link>
        </div>

        <div className="card">
          {materials.length > 0 ? (
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Название</th>
                  <th className="px-4 py-2 text-left">Количество (г/мл)</th>
                  <th className="px-4 py-2 text-left">Уведомления</th>
                  <th className="px-4 py-2 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id} className="border-b">
                    <td className="px-4 py-2">{material.id}</td>
                    <td className="px-4 py-2">{material.name}</td>
                    <td className="px-4 py-2">
                      {material.quantity_storage} г/мл
                    </td>
                    <td className="px-4 py-2">
                      {material.quantity_storage < 10 ? (
                        <span className="text-red-600">Требуется закупка</span>
                      ) : (
                        <span className="text-green-600">
                          Закупка не требуется
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/materials/${material.id}/edit`}
                        className="text-cyan-600 hover:underline"
                      >
                        Редактировать
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl lg:text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg mb-2">Нет материалов</p>
              <Link
                href="/materials/create"
                className="text-cyan-600 hover:underline"
              >
                Добавить новый материал
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
