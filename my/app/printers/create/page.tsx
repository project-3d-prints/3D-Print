"use client";

import { useState } from "react";
import { createPrinter } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";
import AuthGuard from "../../AuthGuard";
import Link from "next/link";

export default function CreatePrinter() {
  const [name, setName] = useState("");
  const [type, setType] = useState<"plastic" | "resin">("plastic");
  const [quantityMaterial, setQuantityMaterial] = useState(0.0);
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "глава лаборатории") {
      toast.error("Только глава лаборатории может добавлять принтеры!");
      return;
    }
    try {
      await createPrinter({
        name,
        type,
        quantity_material: quantityMaterial,
        username: user.username,
      });
      toast.success("Принтер успешно добавлен!");
      router.push("/printers");
    } catch (error) {
      console.error("Error creating printer:", error);
      toast.error("Не удалось добавить принтер");
    }
  };

  return (
    <AuthGuard requiredRole="глава лаборатории">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800">
            Добавить принтер
          </h1>
        </div>

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
                Количество материала в принтере (г/мл) *
              </label>
              <input
                type="number"
                step="0.1"
                value={quantityMaterial}
                onChange={(e) =>
                  setQuantityMaterial(parseFloat(e.target.value) || 0.0)
                }
                className="form-input"
                placeholder="0.0"
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
