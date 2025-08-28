"use client";

import { useState } from "react";
import { createMaterial } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";

export default function CreateMaterial() {
  const [name, setName] = useState("");
  const [quantityPrinter, setQuantityPrinter] = useState(0);
  const [quantityStorage, setQuantityStorage] = useState(0);
  const [printerId, setPrinterId] = useState(0);
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Добавить материал
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Название материала
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="e.g., PLA Filament"
              required
            />
          </div>
          <div>
            <label
              htmlFor="printerId"
              className="block text-sm font-medium text-gray-700"
            >
              ID принтера
            </label>
            <input
              id="printerId"
              type="number"
              value={printerId}
              onChange={(e) => setPrinterId(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="e.g., 1"
              required
            />
          </div>
          <div>
            <label
              htmlFor="quantityPrinter"
              className="block text-sm font-medium text-gray-700"
            >
              Количество в принтере
            </label>
            <input
              id="quantityPrinter"
              type="number"
              value={quantityPrinter}
              onChange={(e) => setQuantityPrinter(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="e.g., 1000"
              required
            />
          </div>
          <div>
            <label
              htmlFor="quantityStorage"
              className="block text-sm font-medium text-gray-700"
            >
              Количество на складе
            </label>
            <input
              id="quantityStorage"
              type="number"
              value={quantityStorage}
              onChange={(e) => setQuantityStorage(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="e.g., 5000"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-700"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
