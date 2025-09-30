"use client";

import { useState, useEffect } from "react";
import { getPrinter, updatePrinterQuantity } from "../../../../lib/api";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "../../../AuthGuard";
import LoadingSpinner from "../../../LoadingSpinner";
import Link from "next/link";

export default function EditPrinter() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<"plastic" | "resin">("plastic");
  const [quantityMaterial, setQuantityMaterial] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrinter() {
      try {
        setIsLoading(true);
        const response = await getPrinter(id);
        const { name, type, quantity_material, warning } = response.data;
        setName(name);
        setType(type);
        setQuantityMaterial(quantity_material);
        setWarning(warning || null);
      } catch (error) {
        console.error("Error fetching printer:", error);
        setError("Не удалось найти принтер");
        toast.error("Не удалось найти принтер");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrinter();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePrinterQuantity({
        printer_id: id,
        quantity_printer: quantityMaterial,
      });
      toast.success("Принтер успешно обновлен!");
      router.push("/printers");
    } catch (error) {
      console.error("Error updating printer:", error);
      toast.error("Не удалось обновить принтер");
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Загружаем принтер..." />;
  }

  if (error) {
    return (
      <AuthGuard requiredRole="глава лаборатории">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
            Редактирование принтера
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
            Редактирование принтера
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
                readOnly
                className="form-input bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Тип принтера
              </label>
              <input
                type="text"
                value={type === "plastic" ? "Пластик" : "Смола"}
                readOnly
                className="form-input bg-gray-100 cursor-not-allowed"
              />
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
                  setQuantityMaterial(parseFloat(e.target.value) || 0)
                }
                className="form-input"
                min="0"
                required
              />
            </div>

            {warning && (
              <div className="text-red-600 text-sm">
                <span className="font-medium">Предупреждение:</span> {warning}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Сохранить изменения
              </button>
              <button
                type="button"
                onClick={() => router.push("/printers")}
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
