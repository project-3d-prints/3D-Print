"use client";

import { useState, useEffect } from "react";
import { getQueue, getPrinters } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import LoadingSpinner from "../LoadingSpinner";

interface Printer {
  id: number;
  name: string;
  status: string;
  owner: string;
}

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
  displayDate?: string;
  created_at?: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("Dashboard user state:", { user, isAuthenticated, authLoading });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const printersResponse = await getPrinters();
        setPrinters(printersResponse.data || []);

        const queueResponse = await getQueue(0, "");
        if (queueResponse.data && Array.isArray(queueResponse.data)) {
          const sortedJobs = queueResponse.data
            .map((job: Job) => ({
              ...job,
              displayDate:
                job.date || job.deadline || job.created_at || "Нет даты",
            }))
            .sort((a: Job, b: Job) => {
              const dateA = new Date(a.displayDate!).getTime();
              const dateB = new Date(b.displayDate!).getTime();
              return dateB - dateA;
            });
          setRecentJobs(sortedJobs.slice(0, 5));
        } else {
          setRecentJobs([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setRecentJobs([]);
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getPrinterName = (printerId: number) => {
    const printer = printers.find((p) => p.id === printerId);
    return printer ? printer.name : "Неизвестный принтер";
  };

  if (authLoading || loading) {
    return <LoadingSpinner text="Загружаем данные..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
        Добро пожаловать, {user?.username || "Неизвестный пользователь"}
      </h1>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-cyan-700">
          Последние заявки
        </h2>

        {recentJobs.length > 0 ? (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-cyan-700">ID:</span>
                    <span className="ml-2">{job.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-cyan-700">Принтер:</span>
                    <span className="ml-2 truncate">
                      {getPrinterName(job.printer_id)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-cyan-700">
                      Пользователь:
                    </span>
                    <span className="ml-2">{job.user || "Не указан"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-cyan-700">Дата:</span>
                    <span className="ml-2 truncate">{job.displayDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl lg:text-6xl mb-4">📃</div>
            <p className="text-gray-500 text-lg">Нет заявок</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-cyan-700">
            {printers.length}
          </div>
          <p className="text-gray-600">Принтеров</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-cyan-700">
            {recentJobs.length}
          </div>
          <p className="text-gray-600">Активных заявок</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-cyan-700 capitalize">
            {user?.role || "Неизвестная роль"}
          </div>
          <p className="text-gray-600">Ваша роль</p>
        </div>
      </div>
    </div>
  );
}
