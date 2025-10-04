"use client";

import { useState, useEffect } from "react";
import { getPrinter, updatePrinterQuantity } from "../../../../lib/api";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "../../../AuthGuard";
import LoadingSpinner from "../../../LoadingSpinner";

export default function EditPrinter() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<"plastic" | "resin">("plastic");
  const [quantityMaterial, setQuantityMaterial] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const printerResponse = await getPrinter(id);
        const { name, type, quantity_material } = printerResponse.data;
        setName(name);
        setType(type);
        setQuantityMaterial(quantity_material);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setError("Не удалось загрузить данные принтера");
        toast.error("Не удалось загрузить данные");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityMaterial < 0) {
      toast.error("Количество материала не может быть отрицательным");
      return;
    }
    try {
      setIsLoading(true);
      await updatePrinterQuantity({
        printer_id: id,
        quantity_printer: quantityMaterial,
      });
      toast.success("Принтер успешно обновлен!");
      router.push("/printers");
    } catch (error) {
      console.error("Ошибка обновления принтера:", error);
      toast.error("Не удалось обновить данные");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Загружаем данные..." />;
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
        <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
          Редактирование принтера
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
                step="1" 
                value={quantityMaterial}
                onChange={(e) =>
                  setQuantityMaterial(parseInt(e.target.value) || 0)
                }
                className="form-input"
                min="0"
                required
              />
            </div>

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
