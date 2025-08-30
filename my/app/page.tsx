"use client";

import { useState, useEffect } from "react";
import { getQueue } from "../lib/api";
import { useAuthStore } from "../lib/store";

interface Job {
  id: number;
  printer: string; // Адаптируем под имя принтера
  date: string;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentJobs() {
      setLoading(true);
      try {
        const response = await getQueue(0, ""); // Все заявки
        console.log("Queue response:", response); // Отладка
        if (response.data && Array.isArray(response.data)) {
          const sortedJobs = response.data
            .map((job: any) => ({
              id: job.id,
              printer: job.printer_id
                ? String(job.printer_id)
                : "Неизвестный принтер", // Адаптация поля
              date: job.date,
            }))
            .sort(
              (a: Job, b: Job) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 3); // Берем последние 3 заявки
          setRecentJobs(sortedJobs);
        } else {
          console.error("Invalid data format from getQueue:", response);
          setRecentJobs([]);
        }
      } catch (err) {
        console.error("Error fetching recent jobs:", err);
        setRecentJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentJobs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Последние заявки</h2>
        {loading ? (
          <p>Загрузка...</p>
        ) : recentJobs.length > 0 ? (
          <ul className="space-y-2">
            {recentJobs.map((job) => (
              <li key={job.id} className="p-2 border-b border-gray-200">
                ID: {job.id}, Принтер: {job.printer}, Дата: {job.date}
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет последних заявок.</p>
        )}
      </div>
    </div>
  );
}
