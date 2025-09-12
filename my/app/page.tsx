"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getQueue } from "../lib/api";
import { useAuthStore } from "../lib/store";

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

export default function Home() {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const router = useRouter();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/users/auth/login");
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const response = await getQueue(0, "");
        console.log("Queue response:", response);
        const jobs = Array.isArray(response) ? response : response.data || [];
        const adaptedJobs = jobs
          .map((job: Job) => ({
            id: job.id,
            printer_id: job.printer_id,
            duration: job.duration,
            deadline: job.deadline,
            material_amount: job.material_amount,
            user: job.user,
            date: job.date || job.deadline || "Нет даты",
            material: job.material,
            priority: job.priority,
          }))
          .sort(
            (a: Job, b: Job) =>
              new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
          )
          .slice(0, 3);
        setRecentJobs(adaptedJobs);
      } catch (err) {
        console.error("Error fetching recent jobs:", err);
        setRecentJobs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto p-4 ml-64">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Последние заявки</h2>
        {loading ? (
          <p>Загрузка...</p>
        ) : recentJobs.length > 0 ? (
          <ul className="space-y-2">
            {recentJobs.map((job) => (
              <li key={job.id} className="p-2 border-b border-gray-200">
                ID: {job.id}, Принтер: {job.printer_id}, Дедлайн: {job.deadline}
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет последних заявок.</p>
        )}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Добро пожаловать, {user?.username || "Гость"}
        </h2>
      </div>
    </div>
  );
}
