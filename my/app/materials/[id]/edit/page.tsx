"use client";

import { useState, useEffect } from "react";
import { updateMaterial, getMaterial } from "../../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditMaterial() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [name, setName] = useState("");
  const [printerId, setPrinterId] = useState(0);
  const [quantityPrinter, setQuantityPrinter] = useState(0.0);
  const [quantityStorage, setQuantityStorage] = useState(0.0);

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

  const handleBack = () => {
    router.push("/materials");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-800 mb-6">
        Редактирование материала
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
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="printerId"
              className="block text-sm font-medium text-cyan-700"
            >
              ID Принтера
            </label>
            <input
              id="printerId"
              type="text"
              value={printerId}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-gray-100"
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
              step="0.1"
              value={quantityPrinter}
              onChange={(e) =>
                setQuantityPrinter(parseFloat(e.target.value) || 0.0)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
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
              step="0.1"
              value={quantityStorage}
              onChange={(e) =>
                setQuantityStorage(parseFloat(e.target.value) || 0.0)
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              min="0"
              required
            />
          </div>
          <div className="flex justify-around">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-white text-cyan-700 rounded-md hover:bg-cyan-100"
            >
              Назад
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
