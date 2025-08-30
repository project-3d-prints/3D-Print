"use client";

import { useState, useEffect } from "react";
import { getQueue, getPrinters } from "../../lib/api";
import { useAuthStore } from "../../lib/store";

interface Job {
  id: number;
  printer_id: number;
  duration: number;
  deadline: string;
  material_amount: number;
  user: string;
  date: string;
  material: string;
  priority: number;
}

interface Printer {
  id: number;
  name: string;
  status: string;
  owner: string;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const printersResponse = await getPrinters();
        setPrinters(printersResponse.data);
        const queueResponse = await getQueue(0, ""); // Все заявки
        console.log("Queue response:", queueResponse); // Отладка
        if (queueResponse.data && Array.isArray(queueResponse.data)) {
          const sortedJobs = queueResponse.data.sort(
            (a: Job, b: Job) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setRecentJobs(sortedJobs.slice(0, 3)); // Берем последние 3 заявки
        } else {
          console.error("Invalid data format from getQueue:", queueResponse);
          setRecentJobs([]); // Устанавливаем пустой массив при ошибке
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setRecentJobs([]); // Устанавливаем пустой массив при ошибке
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getPrinterName = (printerId: number) => {
    const printer = printers.find((p) => p.id === printerId);
    return printer ? printer.name : "Неизвестный принтер";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">
        Добро пожаловать, {user?.username}
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-cyan-700">
          Последние заявки
        </h2>
        {loading ? (
          <p className="text-cyan-700">Загрузка...</p>
        ) : recentJobs.length > 0 ? (
          <ul className="space-y-2">
            {recentJobs.map((job) => (
              <li
                key={job.id}
                className="p-2 border-b border-gray-200 text-cyan-700"
              >
                ID: {job.id}, Принтер: {getPrinterName(job.printer_id)}, Дата:{" "}
                {job.date}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-cyan-700">
            Нет последних заявок. Попробуйте создать заявку.
          </p>
        )}
      </div>
    </div>
  );
}
