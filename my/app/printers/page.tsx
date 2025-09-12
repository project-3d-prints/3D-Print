"use client";

import { useState, useEffect } from "react";
import { getPrinters } from "../../lib/api";

export default function ListPrinters() {
  const [printers, setPrinters] = useState([]);

  useEffect(() => {
    async function fetchPrinters() {
      try {
        const response = await getPrinters();
        setPrinters(response.data || []);
      } catch (err) {
        console.error("Error fetching printers:", err);
      }
    }
    fetchPrinters();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">
        Список принтеров
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        {/* Заголовки таблицы */}
        <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-200 p-2 rounded-md">
          <div className="font-semibold text-cyan-700 text-center">ID</div>
          <div className="font-semibold text-cyan-700">Название</div>
          <div className="font-semibold text-cyan-700">Владелец</div>
        </div>

        {/* Данные таблицы */}
        {printers.length > 0 ? (
          printers.map((printer: any) => (
            <div
              key={printer.id}
              className="grid grid-cols-3 gap-4 p-2 border-b hover:bg-gray-50"
            >
              <div className="text-center">{printer.id}</div>
              <div>{printer.name}</div>
              <div>{printer.username || printer.owner || "Неизвестно"}</div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">Нет принтеров.</div>
        )}
      </div>
    </div>
  );
}
