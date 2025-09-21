"use client";

import { useState, useEffect } from "react";
import { createJob, getPrinters, getMaterials } from "../../../lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import LoadingSpinner from "../../LoadingSpinner";
import AuthGuard from "../../AuthGuard";

interface Printer {
  id: number;
  name: string;
  status: string;
  owner: string;
}

interface Material {
  id: number;
  name: string;
  quantity_printer: number;
  quantity_storage: number;
}

export default function CreateJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    printer_id: "",
    duration: "",
    deadline: "",
    material_amount: "",
    material: "",
  });
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [printersResponse, materialsResponse] = await Promise.all([
          getPrinters(),
          getMaterials(),
        ]);
        setPrinters(printersResponse.data || []);
        setMaterials(materialsResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Не удалось загрузить данные");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    if (!formData.deadline || formData.deadline <= today) {
      toast.error("Дедлайн должен быть валидной датой в будущем!");
      return;
    }

    const selectedMaterial = materials.find(
      (m) => m.name === formData.material
    );
    if (!selectedMaterial) {
      toast.error("Выберите материал из списка!");
      return;
    }
    if (
      selectedMaterial.quantity_printer <
        parseFloat(formData.material_amount) &&
      selectedMaterial.quantity_storage < parseFloat(formData.material_amount)
    ) {
      toast.error("Недостаточно материала на принтере или складе!");
      return;
    }

    try {
      const jobData = {
        printer_id: parseInt(formData.printer_id),
        duration: parseFloat(formData.duration),
        deadline: formData.deadline,
        material_amount: parseFloat(formData.material_amount),
        material_id: selectedMaterial.id.toString(),
      };

      await createJob(jobData);
      toast.success("Заявка успешно создана!");
      router.push("/jobs/queue/0");
    } catch (error) {
      console.error("Error creating job:", error);
      let errorMessage = "Произошла непредвиденная ошибка.";
      if (error instanceof AxiosError) {
        if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Загружаем данные..." />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800">
            Создание заявки
          </h1>
        </div>

        <div className="card max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-1">
                  Принтер *
                </label>
                <select
                  name="printer_id"
                  value={formData.printer_id}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Выберите принтер</option>
                  {printers.map((printer) => (
                    <option key={printer.id} value={printer.id.toString()}>
                      {printer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-1">
                  Длительность (ч) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="form-input"
                  step="0.1"
                  min="0.1"
                  placeholder="0.0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Дедлайн *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-1">
                  Материал *
                </label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Выберите материал</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.name}>
                      {material.name} ({material.quantity_printer}кг доступно)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-1">
                  Количество (кг) *
                </label>
                <input
                  type="number"
                  name="material_amount"
                  value={formData.material_amount}
                  onChange={handleChange}
                  className="form-input"
                  step="0.1"
                  min="0.1"
                  placeholder="0.0"
                  required
                />
              </div>
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
