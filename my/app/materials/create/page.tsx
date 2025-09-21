"use client";

import { useState, useEffect } from "react";
import { createMaterial, getPrinters } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";
import AuthGuard from "../../AuthGuard";
import LoadingSpinner from "../../LoadingSpinner";
import Link from "next/link";

interface Printer {
  id: number;
  name: string;
  status: string;
  owner: string;
}

export default function CreateMaterial() {
  const [name, setName] = useState("");
  const [quantityPrinter, setQuantityPrinter] = useState(0.0);
  const [quantityStorage, setQuantityStorage] = useState(0.0);
  const [printerId, setPrinterId] = useState(0);
  const router = useRouter();
  const { user } = useAuthStore();
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPrinters() {
      try {
        const response = await getPrinters();
        setPrinters(response.data);
      } catch (error) {
        console.error("Error fetching printers:", error);
        toast.error("Не удалось загрузить принтеры");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrinters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (printerId === 0) {
      toast.error("Пожалуйста, выберите принтер");
      return;
    }
    try {
      const newMaterial = {
        name,
        printer_id: printerId,
        quantity_printer: quantityPrinter,
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
    return <LoadingSpinner text="Загружаем принтеры..." />;
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
                Принтер *
              </label>
              <select
                value={printerId}
                onChange={(e) => setPrinterId(Number(e.target.value))}
                className="form-input"
                required
              >
                <option value={0}>Выберите принтер</option>
                {printers.map((printer) => (
                  <option key={printer.id} value={printer.id}>
                    {printer.name}
                  </option>
                ))}
              </select>
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
                  placeholder="0.0"
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
                  placeholder="0.0"
                  required
                />
              </div>
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
