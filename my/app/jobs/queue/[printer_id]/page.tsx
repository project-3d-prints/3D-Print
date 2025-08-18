"use client";

import { useState, useEffect } from "react";
import { getQueue } from "../../../../lib/api";
import { useParams } from "next/navigation";

interface Job {
  id: number;
  user: string;
  date: string;
  material: string;
  duration: number;
  priority: number;
}

export default function JobQueue() {
  const params = useParams();
  const [printerId, setPrinterId] = useState(Number(params.printer_id) || 0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [day, setDay] = useState("");

  useEffect(() => {
    async function fetchQueue() {
      try {
        const response = await getQueue(printerId, day);
        setJobs(response.data);
      } catch (err) {
        console.error("Error fetching job queue:", err);
      }
    }
    fetchQueue();
  }, [printerId, day]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Очередь заявок по принтеру
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Выбор принтера и даты</h2>
        <select
          value={printerId}
          onChange={(e) => setPrinterId(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-600 focus:border-blue-600"
          required
        >
          <option value={0}>Выберите принтер</option>
          <option value={1}>Printer 1</option>
          <option value={2}>Printer 2</option>
        </select>
        <input
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-blue-600 focus:border-blue-600"
        />
      </div>
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Очередь заявок</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-2">ID</th>
              <th className="p-2">Пользователь</th>
              <th className="p-2">Дата</th>
              <th className="p-2">Материал</th>
              <th className="p-2">Длительность</th>
              <th className="p-2">Приоритет</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b">
                <td className="p-2">{job.id}</td>
                <td className="p-2">{job.user}</td>
                <td className="p-2">{job.date}</td>
                <td className="p-2">{job.material}</td>
                <td className="p-2">{job.duration}</td>
                <td className="p-2">{job.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
