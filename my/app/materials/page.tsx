"use client";

import { useState, useEffect } from "react";
import { getMaterials } from "../../lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface Material {
  id: number;
  name: string;
  printer_id: number;
  printer_name: string | null;
  quantity_printer: number;
  quantity_storage: number;
}

export default function ListMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const response = await getMaterials();
        setMaterials(response.data || []);
      } catch (err) {
        console.error("Error fetching materials:", err);
        toast.error("Не удалось загрузить материалы");
      }
    }
    fetchMaterials();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">Материалы</h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        {/* Заголовки таблицы */}
        <div className="grid grid-cols-6 gap-4 mb-4 bg-gray-200 p-2 rounded-md">
          <div className="font-semibold text-cyan-700 text-center">ID</div>
          <div className="font-semibold text-cyan-700">Название</div>
          <div className="font-semibold text-cyan-700">Принтер</div>
          <div className="font-semibold text-cyan-700 text-center">
            В принтере
          </div>
          <div className="font-semibold text-cyan-700 text-center">
            На складе
          </div>
          <div className="font-semibold text-cyan-700 text-center">
            Действия
          </div>
        </div>

        {/* Данные таблицы */}
        {materials.length > 0 ? (
          materials.map((material) => (
            <div
              key={material.id}
              className="grid grid-cols-6 gap-4 p-2 border-b hover:bg-gray-50"
            >
              <div className="text-center">{material.id}</div>
              <div className="truncate">{material.name}</div>
              <div className="truncate">
                {material.printer_id} / {material.printer_name || "Не указано"}
              </div>
              <div className="text-center">{material.quantity_printer}</div>
              <div className="text-center">{material.quantity_storage}</div>
              <div className="text-center">
                <Link href={`/materials/${material.id}/edit`}>
                  <button className="px-2 py-1 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 text-sm">
                    Редактировать
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500 col-span-6">
            Нет материалов.
          </div>
        )}
      </div>
    </div>
  );
}
  