"use client";

import { useState, useEffect } from "react";
import { getQueue } from "../lib/api";
import { useAuthStore } from "../lib/store";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServerJob {
  id: number;
  printer_id: number;
  duration: number;
  deadline: string;
  material_amount: number;
  user: string;
  date?: string;
  material: string;
  priority: number;
  created_at?: string;
}

interface Job {
  id: number;
  printer_id: number;
  duration: number;
  deadline: string;
  material_amount: number;
  user: string;
  displayDate: string;
  material: string;
  priority: number;
}

export default function Home() {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const queueResponse = await getQueue(0, "");
        if (queueResponse.data && Array.isArray(queueResponse.data)) {
          const sortedJobs = queueResponse.data
            .map((job: ServerJob) => ({
              ...job,
              displayDate:
                job.date || job.deadline || job.created_at || "Нет даты",
            }))
            .sort((a: Job, b: Job) => {
              const dateA = new Date(a.displayDate).getTime();
              const dateB = new Date(b.displayDate).getTime();
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

    if (!isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return <LoadingSpinner text="Перенаправляем..." fullScreen={false} />;
  }

  if (loading) {
    return <LoadingSpinner text="Загружаем заявки..." fullScreen={false} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
        Добро пожаловать в ЗD Print
      </h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <Link
            href="/users/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Войдите
          </Link>{" "}
          или{" "}
          <Link
            href="/users/auth/register"
            className="text-blue-600 hover:underline font-medium"
          >
            зарегистрируйтесь
          </Link>{" "}
          для управления заявками и принтерами.
        </p>
      </div>

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
                    <span className="ml-2 truncate">{job.printer_id}</span>
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
    </div>
  );
}
