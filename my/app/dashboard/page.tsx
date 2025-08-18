"use client";

import { useAuthStore } from "../../lib/store";

export default function Dashboard() {
  const { user } = useAuthStore();

  const recentJobs = [
    { id: 1, printer: "Printer 1", date: "2025-08-16" },
    { id: 2, printer: "Printer 2", date: "2025-08-15" },
    { id: 3, printer: "Printer 3", date: "2025-08-14" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">
        Добро пожаловать, {user?.username}
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-cyan-700 ">
          Последние заявки
        </h2>
        <ul className="space-y-2">
          {recentJobs.map((job) => (
            <li
              key={job.id}
              className="p-2 border-b border-gray-200 text-cyan-700"
            >
              ID: {job.id}, Принтер: {job.printer}, Дата: {job.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
