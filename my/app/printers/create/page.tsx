"use client";

import { useState } from "react";
import { createPrinter } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";
import AuthGuard from "../../AuthGuard";
import LoadingSpinner from "../../LoadingSpinner";

export default function CreatePrinter() {
  const [name, setName] = useState("");
  const [type, setType] = useState<"plastic" | "resin">("plastic");
  const [quantityMaterial, setQuantityMaterial] = useState(0);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityMaterial < 0) {
      toast.error("Количество материала не может быть отрицательным!");
      return;
    }
    try {
      setIsLoading(true);
      await createPrinter({
        name,
        type,
        quantity_material: Math.floor(quantityMaterial),
        username,
      });
      toast.success("Принтер успешно добавлен!");
      router.push("/printers");
    } catch (error) {
      console.error("Error creating printer:", error);
      toast.error("Не удалось добавить принтер");
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
          Добавить принтер
        </h1>

        <div className="card max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Название принтера
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Введите название принтера"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Тип принтера
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
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Количество материала (г/мл)
              </label>
              <input
                type="number"
                value={quantityMaterial}
                onChange={(e) =>
                  setQuantityMaterial(parseInt(e.target.value) || 0)
                }
                className="form-input"
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Ответственный
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Введите имя пользователя"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Добавить принтер
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
