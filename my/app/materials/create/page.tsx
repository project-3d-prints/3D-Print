"use client";

import { useState, useEffect } from "react";
import { createMaterial, getPrinters } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";

interface Printer {
  id: number;
  name: string;
  status: string;
  owner: string;
}

export default function CreateMaterial() {
  const [name, setName] = useState("");
  const [quantityPrinter, setQuantityPrinter] = useState(0);
  const [quantityStorage, setQuantityStorage] = useState(0);
  const [printerId, setPrinterId] = useState(0);
  const router = useRouter();
  const { user } = useAuthStore();
  const [printers, setPrinters] = useState<Printer[]>([]);

  useEffect(() => {
    async function fetchPrinters() {
      try {
        const response = await getPrinters();
        setPrinters(response.data);
      } catch (error) {
        console.error("Error fetching printers:", error);
        toast.error("Не удалось загрузить принтеры");
      }
    }
    fetchPrinters();
  }, []);

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
      <h1 className="text-3xl font-bold text-cyan-800 mb-6">
        Добавить материал
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-cyan-700"
            >
              Название материала
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="Введите название материала"
              required
            />
          </div>
          <div>
            <label
              htmlFor="printerId"
              className="block text-sm font-medium text-cyan-700"
            >
              Принтер
            </label>
            <select
              id="printerId"
              value={printerId}
              onChange={(e) => setPrinterId(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
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
          <div>
            <label
              htmlFor="quantityPrinter"
              className="block text-sm font-medium text-cyan-700"
            >
              Количество в принтере
            </label>
            <input
              id="quantityPrinter"
              type="text"
              value={quantityPrinter}
              onChange={(e) => setQuantityPrinter(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="Введите количество"
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
              type="text"
              value={quantityStorage}
              onChange={(e) => setQuantityStorage(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="Введите количество"
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
