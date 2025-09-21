"use client";

import { useState, useEffect } from "react";
import { updateMaterial, getMaterial } from "../../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import AuthGuard from "../../../AuthGuard";
import LoadingSpinner from "../../../LoadingSpinner";
import Link from "next/link";

export default function EditMaterial() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [name, setName] = useState("");
  const [printerId, setPrinterId] = useState(0);
  const [quantityPrinter, setQuantityPrinter] = useState(0.0);
  const [quantityStorage, setQuantityStorage] = useState(0.0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMaterial() {
      try {
        const response = await getMaterial(id);
        const { name, printer_id, quantity_printer, quantity_storage } =
          response.data;
        setName(name);
        setPrinterId(printer_id);
        setQuantityPrinter(quantity_printer);
        setQuantityStorage(quantity_storage);
      } catch (error) {
        console.error("Error fetching material:", error);
        toast.error("Не удалось найти материал");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMaterial();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMaterial(id, {
        quantity_printer: quantityPrinter,
        quantity_storage: quantityStorage,
      });
      toast.success("Материал успешно обновлен!");
      router.push("/materials");
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error("Не удалось обновить материал");
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Загружаем материал..." />;
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  ID Принтера
                </label>
                <input
                  type="text"
                  value={printerId}
                  readOnly
                  className="form-input bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-1">
                  Количество в принтере (кг) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={quantityPrinter}
                  onChange={(e) =>
                    setQuantityPrinter(parseFloat(e.target.value) || 0.0)
                  }
                  className="form-input"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-1">
                  Количество на складе (кг) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={quantityStorage}
                  onChange={(e) =>
                    setQuantityStorage(parseFloat(e.target.value) || 0.0)
                  }
                  className="form-input"
                  min="0"
                  required
                />
              </div>
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
