"use client";

import { useState } from "react";
import { createJob } from "../../../lib/api";
import toast from "react-hot-toast";

export default function CreateJob() {
  const [printerId, setPrinterId] = useState(0);
  const [duration, setDuration] = useState(0);
  const [materialAmount, setMaterialAmount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob({
        printer_id: printerId,
        duration,
        material_amount: materialAmount,
        deadline: new Date().toISOString(),
      });
      toast.success("Job created successfully!");
      setPrinterId(0);
      setDuration(0);
      setMaterialAmount(0);
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Failed to create job");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">Создать заявку</h1>
      <div className="bg-white p-6 rounded-md shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              required
            >
              <option value={0}>Выберите принтер</option>
              <option value={1}>Printer 1</option>
              <option value={2}>Printer 2</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-cyan-700"
            >
              Ожидаемая длительность (часы)
            </label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-600 focus:border-blue-600"
              min="0"
              required
            />
          </div>
          <div>
            <label
              htmlFor="materialAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Количество материала (г)
            </label>
            <input
              id="materialAmount"
              type="number"
              value={materialAmount}
              onChange={(e) => setMaterialAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-600 focus:border-blue-600"
              min="0"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            >
              Создать заявку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
