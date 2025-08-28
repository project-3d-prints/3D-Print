"use client";

import { useState } from "react";
import { createJob } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";

export default function CreateJob() {
  const [printerId, setPrinterId] = useState(0);
  const [duration, setDuration] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [materialAmount, setMaterialAmount] = useState(0);
  const [material, setMaterial] = useState("");
  const [priority, setPriority] = useState(1);
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Пожалуйста, войдите в систему!");
      return;
    }
    try {
      const newJob = {
        printer_id: printerId,
        duration,
        deadline,
        material_amount: materialAmount,
        user: user.username,
        material,
        priority,
        date: new Date().toISOString().split("T")[0], // Добавляем дату
      };
      await createJob(newJob);
      toast.success("Заявка успешно создана!");
      router.push("/jobs/queue");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Не удалось создать заявку");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Создать заявку</h1>
      <div className="bg-white p-6 rounded-md shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700"
            >
              Длительность (часы)
            </label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700"
            >
              Крайний срок
            </label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="materialAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Количество материала
            </label>
            <input
              id="materialAmount"
              type="number"
              value={materialAmount}
              onChange={(e) => setMaterialAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="material"
              className="block text-sm font-medium text-gray-700"
            >
              Материал
            </label>
            <input
              id="material"
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Приоритет
            </label>
            <input
              id="priority"
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              min="1"
              max="5"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
