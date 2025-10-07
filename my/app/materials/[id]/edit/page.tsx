"use client";

import { useState, useEffect } from "react";
import { updateMaterial, getMaterial } from "../../../../lib/api";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "../../../AuthGuard";
import LoadingSpinner from "../../../LoadingSpinner";

export default function EditMaterial() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [name, setName] = useState("");
  const [quantityStorage, setQuantityStorage] = useState(0.0);
  const [type, setType] = useState<"plastic" | "resin">("plastic");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMaterial() {
      try {
        setIsLoading(true);
        const response = await getMaterial(id);
        const { name, quantity_storage, type } = response.data;
        setName(name);
        setQuantityStorage(quantity_storage);
        setType(type || "plastic");
      } catch (error) {
        console.error("Error fetching material:", error);
        setError("Не удалось найти материал");
        toast.error("Не удалось найти материал");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMaterial();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityStorage <= 0) {
      toast.error(
        "Количество материала не может быть отрицательным или нулевым!"
      );
      return;
    }
    try {
      setIsLoading(true);
      await updateMaterial(id, {
        quantity_storage: quantityStorage,
      });
      toast.success("Материал успешно обновлен!");
      router.push("/materials");
    } catch (error: any) {
      console.error("Error updating material:", error);
      const errorMessage = error.message || "Не удалось обновить материал";
      if (
        errorMessage.includes(
          "Количество материала не может быть отрицательным или нулевым"
        )
      ) {
        toast.error(
          "Количество материала не может быть отрицательным или нулевым"
        );
      } else if (errorMessage.includes("Материал не найден")) {
        toast.error("Материал не найден");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Загружаем материал..." />;
  }

  if (error) {
    return (
      <AuthGuard requiredRole="глава лаборатории">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
            Редактирование материала
          </h1>
          <div className="card text-center py-8">
            <div className="text-4xl lg:text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg mb-2">{error}</p>
            <p className="text-gray-500 text-sm">
              Попробуйте обновить страницу или проверьте сервер.
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="глава лаборатории">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800">
            Редактирование материала
          </h1>
        </div>

        <div className="card max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Название материала
              </label>
              <input
                type="text"
                value={name}
                readOnly
                className="form-input bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Тип материала
              </label>
              <select
                value={type}
                disabled
                className="form-input bg-gray-100 cursor-not-allowed"
              >
                <option value="plastic">Пластик</option>
                <option value="resin">Смола</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Тип материала нельзя изменить после создания
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Количество на складе (г/мл) *
              </label>
              <input
                type="number"
                step="0.1"
                value={quantityStorage}
                onChange={(e) =>
                  setQuantityStorage(parseFloat(e.target.value) || 0.0)
                }
                className="form-input"
                min="0.1"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Сохранить изменения
              </button>
              <button
                type="button"
                onClick={() => router.push("/materials")}
                className="btn btn-secondary"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
