"use client";

import { useState, useEffect } from "react";
import { createJob, getPrinters, getMaterials } from "../../../lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

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

  useEffect(() => {
    async function fetchData() {
      try {
        const printersResponse = await getPrinters();
        setPrinters(printersResponse.data || []);
        const materialsResponse = await getMaterials();
        setMaterials(materialsResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Не удалось загрузить данные");
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
      console.log("Sending job data:", jobData);
      await createJob(jobData);
      toast.success("Заявка успешно создана!");
      router.push("/jobs/queue/0");
    } catch (error) {
      console.error("Error creating job:", error);
      let errorMessage = "Произошла непредвиденная ошибка.";
      if (error instanceof AxiosError) {
        if (
          error.response &&
          typeof error.response.data === "object" &&
          error.response.data.detail
        ) {
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-800 mb-6">Создание заявки</h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-cyan-700">
              Принтер
            </label>
            <select
              name="printer_id"
              value={formData.printer_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-cyan-700">
              Длительность (ч)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              step="0.1"
              min="0.1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-cyan-700">
              Дедлайн
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-cyan-700">
              Материал
            </label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              required
            >
              <option value="">Выберите материал</option>
              {materials.map((material) => (
                <option key={material.id} value={material.name}>
                  {material.name} (Принтер: {material.quantity_printer}кг,
                  Склад: {material.quantity_storage}кг)
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-cyan-700">
              Количество материала (кг)
            </label>
            <input
              type="number"
              name="material_amount"
              value={formData.material_amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              step="0.1"
              min="0.1"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800"
          >
            Создать
          </button>
        </form>
      </div>
      <div className="mt-4">
        <Link href="/dashboard">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            Назад
          </button>
        </Link>
      </div>
    </div>
  );
}
