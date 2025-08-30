"use client";

import { useState } from "react";
import { createPrinter } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";

export default function CreatePrinter() {
  const [name, setName] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "глава лаборатории") {
      toast.error("Только глава лаборатории может добавлять принтеры!");
      return;
    }
    try {
      await createPrinter({ name, status: "active", owner: user.username });
      toast.success("Принтер успешно добавлен!");
      router.push("/printers");
    } catch (error) {
      console.error("Error creating printer:", error);
      toast.error("Не удалось добавить принтер");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-800 mb-6">
        Добавить принтер
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-cyan-700"
            >
              Название принтера
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              placeholder="Введите название принтера"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
