"use client";

import { useState, useEffect } from "react";
import { createJob, getMaterials, getPrinters } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";

interface Material {
  id: number;
  name: string;
  printer_id: number;
  quantity_printer: number;
  quantity_storage: number;
}

interface Printer {
  id: number;
  name: string;
  status: string;
  owner: string;
}

export default function CreateJob() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [formData, setFormData] = useState({
    printer_id: 0,
    duration: 0,
    deadline: "",
    material_amount: 0,
    material: "",
    priority: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const materialsResponse = await getMaterials();
        setMaterials(materialsResponse.data);
        const printersResponse = await getPrinters();
        setPrinters(printersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Не удалось загрузить данные");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      let priority = 3;
      if (user.role === "глава лаборатории") priority = 1;
      else if (user.role === "учитель") priority = 2;
      setFormData((prev) => ({ ...prev, priority }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMaterial = materials.find(
      (m) => m.name === formData.material
    );
    if (!selectedMaterial) {
      toast.error("Выбран материал, которого нет в списке!");
      return;
    }
    if (
      selectedMaterial.quantity_printer < formData.material_amount &&
      selectedMaterial.quantity_storage < formData.material_amount
    ) {
      toast.error("Недостаточно материала на принтере или складе!");
      return;
    }

    try {
      await createJob({
        ...formData,
        user: user?.username || "unknown",
        date: new Date().toISOString().split("T")[0],
      });
      toast.success("Заявка успешно создана!");
      router.push("/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Не удалось создать заявку");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
      (name === "material_amount" ||
        name === "duration" ||
        name === "printer_id") &&
      value !== "" &&
      isNaN(Number(value))
    ) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "material_amount" ||
        name === "duration" ||
        name === "printer_id"
          ? Number(value) || 0
          : value,
    }));
  };

  const getDisplayName = (
    name: string,
    id: number,
    items: { id: number; name: string }[]
  ) => {
    const nameCount = items.filter((item) => item.name === name).length;
    if (nameCount > 1) {
      const idCount = items.filter(
        (item) => item.name === name && item.id <= id
      ).length;
      return `${name} ${idCount}`;
    }
    return name;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-800 mb-6">Создание заявки</h1>
      <div className="bg-white p-6 rounded-md shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="printer_id"
              className="block text-sm font-medium text-cyan-700"
            >
              Принтер
            </label>
            <select
              id="printer_id"
              name="printer_id"
              value={formData.printer_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              required
            >
              <option value={0}>Выберите принтер</option>
              {printers.map((printer) => (
                <option key={printer.id} value={printer.id}>
                  {getDisplayName(printer.name, printer.id, printers)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-cyan-700"
            >
              Длительность (часы)
            </label>
            <input
              id="duration"
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              min="0"
              required
            />
          </div>
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-cyan-700"
            >
              Крайний срок
            </label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              required
            />
          </div>
          <div>
            <label
              htmlFor="material"
              className="block text-sm font-medium text-cyan-700"
            >
              Материал
            </label>
            <select
              id="material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              required
            >
              <option value="">Выберите материал</option>
              {materials.map((material) => (
                <option key={material.id} value={material.name}>
                  {getDisplayName(material.name, material.id, materials)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="material_amount"
              className="block text-sm font-medium text-cyan-700"
            >
              Количество материала
            </label>
            <input
              id="material_amount"
              type="text"
              name="material_amount"
              value={formData.material_amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              min="0"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
