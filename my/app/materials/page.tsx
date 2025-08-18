"use client";

import { useState, useEffect } from "react";
import { getMaterials } from "../../lib/api";
import Link from "next/link";

interface Material {
  id: number;
  name: string;
  printer: string;
  quantity_printer: number;
  quantity_storage: number;
}

export default function ListMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const response = await getMaterials();
        setMaterials(response.data);
      } catch (err) {
        console.error("Error fetching materials:", err);
      }
    }
    fetchMaterials();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">
        Список материалов
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-cyan-700">
              <th className="p-2">ID</th>
              <th className="p-2">Название</th>
              <th className="p-2">Принтер</th>
              <th className="p-2">В принтере</th>
              <th className="p-2">На складе</th>
              <th className="p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id} className="border-b">
                <td className="p-2">{material.id}</td>
                <td className="p-2">{material.name}</td>
                <td className="p-2">{material.printer}</td>
                <td className="p-2">{material.quantity_printer}</td>
                <td className="p-2">{material.quantity_storage}</td>
                <td className="p-2">
                  <Link
                    href={`/materials/${material.id}/edit`}
                    className="text-cyan-600 hover:text-cyan-700"
                  >
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
