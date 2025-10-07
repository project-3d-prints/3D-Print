"use client";

import { useState, useEffect, useRef } from "react";
import { getMaterials } from "../../lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import AuthGuard from "../AuthGuard";
import Link from "next/link";

interface Material {
  id: number;
  name: string;
  quantity_storage: number;
  type: "plastic" | "resin";
  warning?: boolean;
}

export default function Materials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasShownCriticalToast = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getMaterials();

        if (response && Array.isArray(response.data)) {
          const allMaterials = response.data;
          setMaterials(allMaterials);

          const criticalMaterials = allMaterials.filter(
            (material) => material.warning === true
          );

          if (criticalMaterials.length > 0 && !hasShownCriticalToast.current) {
            if (criticalMaterials.length === 1) {
              toast.error(
                `Материал "${criticalMaterials[0].name}" достиг критического запаса!`,
                {
                  duration: 5000,
                }
              );
            } else {
              toast.error(
                `${criticalMaterials.length} материалов достигли критического запаса! Проверьте склад.`,
                {
                  duration: 6000,
                }
              );
            }
            hasShownCriticalToast.current = true;
          }
        } else {
          console.warn("Unexpected response format:", response);
          setMaterials([]);
          setError("Неверный формат данных от сервера");
        }
      } catch (err: any) {
        console.error("Ошибка загрузки данных:", err.message);
        const errorMessage = err.message || "Ошибка при загрузке материалов";
        setError(errorMessage);
        toast.error(errorMessage);
        setMaterials([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const outOfStockMaterials = materials.filter(
    (material) => material.warning === true
  );

  const lowStockMaterials = materials.filter(
    (material) =>
      material.quantity_storage > 0 &&
      material.quantity_storage < 10 &&
      !material.warning
  );

  const zeroStockMaterials = materials.filter(
    (material) => material.quantity_storage === 0
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
          Список материалов
        </h1>

        {zeroStockMaterials.length > 0 && (
          <div className="mb-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-orange-400"
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
                  <h3 className="text-sm font-medium text-orange-800">
                    Следующие материалы закончились:
                  </h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <ul className="list-disc list-inside space-y-1">
                      {zeroStockMaterials.map((material) => (
                        <li key={material.id}>
                          <strong>{material.name}</strong> (ID: {material.id}) -{" "}
                          {material.quantity_storage} г/мл
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3">
                    <Link
                      href="/materials/create"
                      className="text-sm font-medium text-orange-800 hover:text-orange-900 underline"
                    >
                      Добавить новый материал →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {outOfStockMaterials.length > 0 && (
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
                    Внимание! Следующие материалы достигли критического запаса:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {outOfStockMaterials.map((material) => (
                        <li key={material.id}>
                          <strong>{material.name}</strong> (ID: {material.id}) -{" "}
                          {material.quantity_storage} г/мл
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {lowStockMaterials.length > 0 && (
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
                    Внимание! Низкий запас материалов:
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      {lowStockMaterials.map((material) => (
                        <li key={material.id}>
                          <strong>{material.name}</strong> - осталось{" "}
                          {material.quantity_storage} г/мл
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          {materials.length > 0 ? (
            <>
              <div className="desktop-only overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Название</th>
                      <th className="px-4 py-2 text-left">Тип</th>
                      <th className="px-4 py-2 text-left">Количество (г/мл)</th>
                      <th className="px-4 py-2 text-left">Статус</th>
                      <th className="px-4 py-2 text-left">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((material) => (
                      <tr
                        key={material.id}
                        className={`border-b hover:bg-gray-50 ${
                          material.quantity_storage === 0 ? "bg-orange-50" : ""
                        }`}
                      >
                        <td className="px-4 py-2">{material.id}</td>
                        <td className="px-4 py-2 font-medium">
                          {material.name}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              material.type === "plastic"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {material.type === "plastic" ? "Пластик" : "Смола"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={
                              material.quantity_storage === 0
                                ? "text-orange-600 font-semibold"
                                : material.warning
                                ? "text-red-600 font-semibold"
                                : material.quantity_storage < 10
                                ? "text-yellow-600 font-semibold"
                                : "text-gray-800"
                            }
                          >
                            {material.quantity_storage} г/мл
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {material.quantity_storage === 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Закончился
                            </span>
                          ) : material.warning ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Критический запас
                            </span>
                          ) : material.quantity_storage < 10 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Мало
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Достаточно
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <Link
                            href={`/materials/${material.id}/edit`}
                            className="text-cyan-600 hover:underline font-medium"
                          >
                            Редактировать
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mobile-only space-y-3">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className={`table-card ${
                      material.quantity_storage === 0 ? "bg-orange-50" : ""
                    }`}
                  >
                    <div className="table-card-header">
                      {material.name} (ID: {material.id})
                    </div>
                    <div className="table-card-row">
                      <span className="table-card-label">Тип:</span>
                      <span
                        className={`table-card-value inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          material.type === "plastic"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {material.type === "plastic" ? "Пластик" : "Смола"}
                      </span>
                    </div>
                    <div className="table-card-row">
                      <span className="table-card-label">Количество:</span>
                      <span
                        className={`table-card-value ${
                          material.quantity_storage === 0
                            ? "text-orange-600 font-semibold"
                            : material.warning
                            ? "text-red-600 font-semibold"
                            : material.quantity_storage < 10
                            ? "text-yellow-600 font-semibold"
                            : "text-gray-800"
                        }`}
                      >
                        {material.quantity_storage} г/мл
                      </span>
                    </div>
                    <div className="table-card-row">
                      <span className="table-card-label">Статус:</span>
                      <span
                        className={`table-card-value inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          material.quantity_storage === 0
                            ? "bg-orange-100 text-orange-800"
                            : material.warning
                            ? "bg-red-100 text-red-800"
                            : material.quantity_storage < 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {material.quantity_storage === 0
                          ? "Закончился"
                          : material.warning
                          ? "Критический запас"
                          : material.quantity_storage < 10
                          ? "Мало"
                          : "Достаточно"}
                      </span>
                    </div>
                    <div className="table-card-row">
                      <span className="table-card-label">Действия:</span>
                      <Link
                        href={`/materials/${material.id}/edit`}
                        className="table-card-value text-cyan-600 hover:underline font-medium"
                      >
                        Редактировать
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href="/materials/create"
                  className="btn btn-primary inline-flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Добавить материал
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl lg:text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg mb-2">Нет материалов</p>
              <Link
                href="/materials/create"
                className="text-cyan-600 hover:underline font-medium"
              >
                Добавить новый материал
              </Link>
            </div>
          )}
        </div>

        {materials.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {materials.length}
              </div>
              <div className="text-sm text-blue-800">Всего материалов</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  materials.filter(
                    (m) => !m.warning && m.quantity_storage >= 10
                  ).length
                }
              </div>
              <div className="text-sm text-green-800">Достаточно</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {zeroStockMaterials.length}
              </div>
              <div className="text-sm text-orange-800">Закончились</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {outOfStockMaterials.length}
              </div>
              <div className="text-sm text-red-800">Критический запас</div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
