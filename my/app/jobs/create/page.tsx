"use client";

import { useState, useEffect } from "react";
import { getPrinters, getMaterials, createJob } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";
import AuthGuard from "../../AuthGuard";
import LoadingSpinner from "../../LoadingSpinner";

export default function CreateJob() {
  const [printers, setPrinters] = useState<
    { id: number; name: string; type: string }[]
  >([]);
  const [materials, setMaterials] = useState<
    { id: number; name: string; quantity_storage: number }[]
  >([]);
  const [printerId, setPrinterId] = useState(0);
  const [duration, setDuration] = useState(0.0);
  const [deadline, setDeadline] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [materialAmount, setMaterialAmount] = useState(0.0);
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const printersResponse = await getPrinters();
        const materialsResponse = await getMaterials();
        console.log("Printers:", printersResponse.data);
        console.log("Materials:", materialsResponse.data);
        setPrinters(printersResponse.data || []);
        setMaterials(materialsResponse.data || []);
        if (materialsResponse.data.length === 0) {
          toast.error("Материалы не найдены. Пожалуйста, добавьте материалы.");
        }
      } catch (err: any) {
        console.error("Ошибка загрузки данных:", err.message);
        toast.error("Ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (printerId === 0) {
      toast.error("Выберите принтер!");
      return;
    }
    if (materialId === "") {
      toast.error("Выберите материал!");
      return;
    }
    if (materialAmount <= 0) {
      toast.error("Количество материала должно быть больше 0!");
      return;
    }
    if (duration <= 0) {
      toast.error("Длительность должна быть больше 0!");
      return;
    }
    const selectedMaterial = materials.find(
      (m) => m.id === parseInt(materialId)
    );
    if (!selectedMaterial) {
      toast.error("Материал не найден!");
      return;
    }
    if (selectedMaterial.quantity_storage < materialAmount) {
      toast.error(
        `Недостаточно материала: доступно ${selectedMaterial.quantity_storage} г/мл, требуется ${materialAmount} г/мл`
      );
      return;
    }
    const selectedPrinter = printers.find((p) => p.id === printerId);
    if (!selectedPrinter) {
      toast.error("Принтер не найден!");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (deadline < today) {
      toast.error("Дедлайн должен быть в будущем!");
      return;
    }
    try {
      setIsLoading(true);
      await createJob({
        printer_id: printerId,
        duration,
        deadline,
        material_amount: materialAmount,
        material_id: materialId, // Убрано parseInt, так как materialId уже строка
      });
      toast.success("Заявка успешно создана!");
      router.push("/jobs/queue/0");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Не удалось создать заявку");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Загружаем данные..." />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
          Создать заявку
        </h1>

        <div className="card max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Принтер
              </label>
              <select
                value={printerId}
                onChange={(e) => {
                  setPrinterId(Number(e.target.value));
                  setMaterialId(""); // Сбрасываем материал при смене принтера
                }}
                className="form-input"
                required
              >
                <option value={0}>Выберите принтер</option>
                {printers.map((printer) => (
                  <option key={printer.id} value={printer.id}>
                    {printer.name} (
                    {printer.type === "plastic" ? "Пластик" : "Смола"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Материал
              </label>
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Выберите материал</option>
                {materials.length > 0 ? (
                  materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name} ({material.quantity_storage} г/мл)
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Нет доступных материалов
                  </option>
                )}
              </select>
              {materials.length === 0 && (
                <p className="text-red-600 text-sm mt-1">
                  Материалы отсутствуют. Пожалуйста, добавьте материалы.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Количество материала (г/мл)
              </label>
              <input
                type="number"
                step="0.1"
                value={materialAmount}
                onChange={(e) =>
                  setMaterialAmount(parseFloat(e.target.value) || 0.0)
                }
                className="form-input"
                placeholder="0.0"
                min="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Длительность (ч)
              </label>
              <input
                type="number"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value) || 0.0)}
                className="form-input"
                placeholder="0.0"
                min="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Дедлайн
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Создать заявку
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
