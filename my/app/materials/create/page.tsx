"use client";

import { useState } from "react";
import { createMaterial } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";

interface Material {
  name: string;
  quantity: number;
  printer_id: number;
  quantity_printer: number;
  quantity_storage: number;
}

export default function CreateMaterial() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [printerId, setPrinterId] = useState(0);
  const [quantityPrinter, setQuantityPrinter] = useState(0);
  const [quantityStorage, setQuantityStorage] = useState(0);
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "глава лаборатории") {
      toast.error("Только глава лаборатории может добавлять материалы!");
      return;
    }
    try {
      const newMaterial = {
        name,
        quantity,
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
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">
        Добавить материал
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-cyan-700"
            >
              Название
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-cyan-700"
            >
              Общее количество
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-600 focus:border-blue-600"
              min="0"
              required
            />
          </div>
          <div>
            <label
              htmlFor="printerId"
              className="block text-sm font-medium text-cyan-700"
            >
              ID принтера
            </label>
            <input
              id="printerId"
              type="number"
              value={printerId}
              onChange={(e) => setPrinterId(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-600 focus:border-blue-600"
              min="0"
              required
            />
          </div>
          <div>
            <label
              htmlFor="quantityPrinter"
              className="block text-sm font-medium text-cyan-700"
            >
              Количество в принтере
            </label>
            <input
              id="quantityPrinter"
              type="number"
              value={quantityPrinter}
              onChange={(e) => setQuantityPrinter(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-600 focus:border-blue-600"
              min="0"
              required
            />
          </div>
          <div>
            <label
              htmlFor="quantityStorage"
              className="block text-sm font-medium text-cyan-700"
            >
              Количество на складе
            </label>
            <input
              id="quantityStorage"
              type="number"
              value={quantityStorage}
              onChange={(e) => setQuantityStorage(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-600 focus:border-blue-600"
              min="0"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-cyan-700"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
