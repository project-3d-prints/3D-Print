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
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-cyan-700">
              <th className="p-2">ID</th>
              <th className="p-2">Название</th>
              <th className="p-2">Принтер (ID / Название)</th>
              <th className="p-2">В принтере</th>
              <th className="p-2">На складе</th>
              <th className="p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {materials.length > 0 ? (
              materials.map((material) => (
                <tr key={material.id} className="border-b">
                  <td className="p-2">{material.id}</td>
                  <td className="p-2">{material.name}</td>
                  <td className="p-2">
                    {material.printer_id} /{" "}
                    {material.printer_name || "Не указано"}
                  </td>
                  <td className="p-2">{material.quantity_printer}</td>
                  <td className="p-2">{material.quantity_storage}</td>
                  <td className="p-2">
                    <Link href={`/materials/${material.id}/edit`}>
                      <button className="px-2 py-1 bg-cyan-700 text-white rounded-md hover:bg-cyan-800">
                        Редактировать
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-2 text-center">
                  Нет материалов.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
