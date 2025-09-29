"use client";

import { useState } from "react";
import { createMaterial } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";
import AuthGuard from "../../AuthGuard";
import LoadingSpinner from "../../LoadingSpinner";
import Link from "next/link";

export default function CreateMaterial() {
  const [name, setName] = useState("");
  const [quantityStorage, setQuantityStorage] = useState(0.0);
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMaterial = {
        name,
        quantity_storage: quantityStorage,
      };
      await createMaterial(newMaterial);
      toast.success("Материал успешно добавлен!");
      router.push("/materials");
    } catch (error) {
      console.error("Error creating material:", error);
      toast.error("Не удалось добавить материал");
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Загружаем данные..." />;
  }

  return (
    <AuthGuard requiredRole="глава лаборатории">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800">
            Добавить материал
          </h1>
        </div>

        <div className="card max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Название материала *
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
                placeholder="0.0"
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
