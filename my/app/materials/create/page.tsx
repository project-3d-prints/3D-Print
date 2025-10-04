"use client";

import { useState } from "react";
import { createMaterial } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";
import AuthGuard from "../../AuthGuard";
import LoadingSpinner from "../../LoadingSpinner";

export default function CreateMaterial() {
  const [name, setName] = useState("");
  const [quantityStorage, setQuantityStorage] = useState(0.0);
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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
      await createMaterial({ name, quantity_storage: quantityStorage });
      toast.success("Материал успешно добавлен!");
      router.push("/materials");
    } catch (error: any) {
      console.error("Error creating material:", error);
      const errorMessage = error.message || "Не удалось добавить материал";
      if (errorMessage.includes("Материал с таким названием уже есть")) {
        toast.error("Материал с таким названием уже есть");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Загружаем данные..." />;
  }

  return (
    <AuthGuard requiredRole="глава лаборатории">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
          Добавить материал
        </h1>

        <div className="card max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Название материала
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Введите название материала"
                required
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Тип материала 
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "plastic" | "resin")}
                className="form-input"
                required
              >
                <option value="plastic">Пластик</option>
                <option value="resin">Смола</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Тип материала будет использоваться в будущем
              </p>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Количество на складе (г/мл)
              </label>
              <input
                type="number"
                step="0.1"
                value={quantityStorage}
                onChange={(e) =>
                  setQuantityStorage(parseFloat(e.target.value) || 0.0)
                }
                className="form-input"
                placeholder="0.0"
                min="0.1"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Добавить материал
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
