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
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-cyan-700">
              <th className="p-2">ID</th>
              <th className="p-2">Название</th>
              <th className="p-2">Владелец</th>
            </tr>
          </thead>
          <tbody>
            {printers.length > 0 ? (
              printers.map((printer: any) => (
                <tr key={printer.id} className="border-b">
                  <td className="p-2">{printer.id}</td>
                  <td className="p-2">{printer.name}</td>
                  <td className="p-2">
                    {printer.username || printer.owner || "Неизвестно"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-2 text-center">
                  Нет принтеров.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
