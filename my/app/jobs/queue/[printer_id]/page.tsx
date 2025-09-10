"use client";

import { useState, useEffect } from "react";
import { getQueue, getPrinters } from "../../../../lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface Job {
  id: number;
  user: string;
  date: string;
  material: string;
  duration: number;
  priority: number;
  printer_id: number;
}

interface Printer {
  id: number;
  name: string;
  status: string;
  owner: string;
}

export default function JobQueue() {
  const params = useParams();
  const [printerId, setPrinterId] = useState<number>(0); // Начальное значение — "Все принтеры"
  const [jobs, setJobs] = useState<Job[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [day, setDay] = useState<string>("");

  // Загружаем данные при монтировании и обновляем при изменении printerId или day
  useEffect(() => {
    async function fetchData() {
      try {
        // Сначала загружаем принтеры
        const printersResponse = await getPrinters();
        setPrinters(printersResponse.data || []);

        // Устанавливаем printerId из params, если он валиден
        const paramPrinterId = Number(params.printer_id);
        if (
          paramPrinterId &&
          printersResponse.data.some((p: Printer) => p.id === paramPrinterId)
        ) {
          setPrinterId(paramPrinterId);
        }

        // Загружаем очередь с учетом фильтров
        const response = await getQueue(printerId || 0, day);
        let filteredJobs = response.data || [];
        if (printerId !== 0) {
          filteredJobs = filteredJobs.filter(
            (job: Job) => job.printer_id === printerId
          );
        }
        setJobs(filteredJobs);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Не удалось загрузить данные");
      }
    }
    fetchData();
  }, [params.printer_id, printerId, day]); // Зависимости для перезагрузки

  const getDisplayName = (name: string, id: number) => {
    const nameCount = printers.filter((p: Printer) => p.name === name).length;
    if (nameCount > 1) {
      const idCount = printers.filter(
        (p: Printer) => p.name === name && p.id <= id
      ).length;
      return `${name} ${idCount}`;
    }
    return name;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-cyan-800 mb-6">
        Очередь заявок по принтеру
      </h1>
      <div className="bg-white p-6 rounded-md shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Выбор принтера и даты</h2>
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label
              htmlFor="printerId"
              className="block text-sm font-medium text-cyan-700"
            >
              Принтер
            </label>
            <select
              id="printerId"
              value={printerId}
              onChange={(e) => setPrinterId(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
            >
              <option value={0}>Все принтеры</option>
              {printers.map((printer: Printer) => (
                <option key={printer.id} value={printer.id}>
                  {getDisplayName(printer.name, printer.id)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label
              htmlFor="day"
              className="block text-sm font-medium text-cyan-700"
            >
              Дата
            </label>
            <input
              id="day"
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
            />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-md shadow-md">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-cyan-700">
              <th className="p-2">ID</th>
              <th className="p-2">Принтер</th>
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
                <td className="p-2">
                  {printers.find((p) => p.id === job.printer_id)?.name ||
                    job.printer_id}
                </td>
                <td className="p-2">{job.user || "Не указан"}</td>
                <td className="p-2">{job.date || "Не указана"}</td>
                <td className="p-2">{job.material || "Не указан"}</td>
                <td className="p-2">{job.duration}</td>
                <td className="p-2">{job.priority || "Не указан"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Link href="/dashboard">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            Назад
          </button>
        </Link>
      </div>
    </div>
  );
}
