"use client";

import { useState, useEffect } from "react";
import { getQueue } from "../../lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function JobsList() {
  const params = useParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [day, setDay] = useState<string>(
    Array.isArray(params.day) ? params.day[0] || "" : params.day || ""
  ); // Обработка string | string[]

  useEffect(() => {
    async function fetchJobs() {
      try {
        const printerId = Number(params.printerId) || 0; // Предполагаем, что есть printerId
        const response = await getQueue(printerId, day);
        setJobs(response.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    }
    fetchJobs();
  }, [params.printerId, day]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Список заявок</h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label
            htmlFor="day"
            className="block text-sm font-medium text-gray-700"
          >
            Дата
          </label>
          <input
            id="day"
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
          />
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-2">ID</th>
              <th className="p-2">Принтер</th>
              <th className="p-2">Длительность</th>
              <th className="p-2">Крайний срок</th>
              <th className="p-2">Материал</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b">
                <td className="p-2">{job.id}</td>
                <td className="p-2">{job.printer_id}</td>
                <td className="p-2">{job.duration}</td>
                <td className="p-2">{job.deadline}</td>
                <td className="p-2">{job.material}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
