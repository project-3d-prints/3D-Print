"use client";

import { useState } from "react";
import { createPrinter } from "../../../lib/api";
import toast from "react-hot-toast";

export default function AddPrinter() {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPrinter(name);
      toast.success("Принтер успешно добавлен!");
      setName("");
    } catch (error) {
      console.error("Error adding printer:", error);
      toast.error("Failed to add printer");
    }
  };

  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cayn-700 focus:border-cayn-600"
              placeholder="e.g., Ender 3"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-cyan-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
