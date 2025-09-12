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
  const [printerId, setPrinterId] = useState<number>(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [day, setDay] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const printersResponse = await getPrinters();
        setPrinters(printersResponse.data || []);

        const paramPrinterId = Number(params.printer_id);
        if (
          paramPrinterId &&
          printersResponse.data.some((p: Printer) => p.id === paramPrinterId)
        ) {
          setPrinterId(paramPrinterId);
        }

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
  }, [params.printer_id, printerId, day]);

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

      {/* Фильтры */}
      <div className="bg-white p-6 rounded-md shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Выбор принтера и даты</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
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
          <div>
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

      {/* Таблица заявок */}
      <div className="bg-white p-6 rounded-md shadow-md">
        {/* Заголовки таблицы */}
        <div className="grid grid-cols-7 gap-4 mb-4 bg-gray-200 p-2 rounded-md">
          <div className="font-semibold text-cyan-700 text-center">ID</div>
          <div className="font-semibold text-cyan-700">Принтер</div>
          <div className="font-semibold text-cyan-700">Пользователь</div>
          <div className="font-semibold text-cyan-700">Дата</div>
          <div className="font-semibold text-cyan-700">Материал</div>
          <div className="font-semibold text-cyan-700 text-center">
            Длительность
          </div>
          <div className="font-semibold text-cyan-700 text-center">
            Приоритет
          </div>
        </div>

        {/* Данные таблицы */}
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.id}
              className="grid grid-cols-7 gap-4 p-2 border-b hover:bg-gray-50"
            >
              <div className="text-center">{job.id}</div>
              <div className="truncate">
                {printers.find((p) => p.id === job.printer_id)?.name ||
                  job.printer_id}
              </div>
              <div className="truncate">{job.user || "Не указан"}</div>
              <div className="truncate">{job.date || "Не указана"}</div>
              <div className="truncate">{job.material || "Не указан"}</div>
              <div className="text-center">{job.duration}</div>
              <div className="text-center">{job.priority || "Не указан"}</div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500 col-span-7">
            Нет заявок.
          </div>
        )}
      </div>
    </div>
  );
}
