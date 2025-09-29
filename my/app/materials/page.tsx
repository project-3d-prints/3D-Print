"use client";

import { useState, useEffect } from "react";
import { getMaterials } from "../../lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import AuthGuard from "../AuthGuard";
import LoadingSpinner from "../LoadingSpinner";

interface Material {
  id: number;
  name: string;
  quantity_storage: number;
}

export default function ListMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const response = await getMaterials();
        setMaterials(response.data || []);
      } catch (err) {
        console.error("Error fetching materials:", err);
        toast.error("Не удалось загрузить материалы");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMaterials();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Загружаем материалы..." />;
  }

  return (
    <AuthGuard requiredRole="глава лаборатории">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-cyan-700">
            Материалы
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
                  <th className="px-3 py-2 text-center text-sm font-medium text-cyan-700">
                    На складе (г/мл)
                  </th>
                  <th className="px-3 py-2 text-center text-sm font-medium text-cyan-700">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">{material.id}</td>
                    <td className="px-3 py-2 text-sm font-medium">
                      {material.name}
                    </td>
                    <td className="px-3 py-2 text-sm text-center">
                      {material.quantity_storage}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Link href={`/materials/${material.id}/edit`}>
                        <button className="btn btn-primary text-xs px-2 py-1">
                          Редактировать
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {materials.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl lg:text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg mb-2">Нет материалов</p>
              <Link
                href="/materials/create"
                className="btn btn-primary text-sm"
              >
                Добавить первый материал
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
