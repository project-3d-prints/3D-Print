"use client";

import { useState, useEffect } from "react";
import { getQueue, getPrinters } from "../../../../lib/api";
import { useParams } from "next/navigation";

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
  const [printerId, setPrinterId] = useState<number>(
    Number(params.printer_id) || 0
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [day, setDay] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const printersResponse = await getPrinters();
        setPrinters(printersResponse.data);

        if (
          params.printer_id &&
          !printersResponse.data.some(
            (p: Printer) => p.id === Number(params.printer_id)
          )
        ) {
          setPrinterId(0);
        } else if (params.printer_id) {
          setPrinterId(Number(params.printer_id));
        }

        const response = await getQueue(printerId || 0, day);
        setJobs(
          printerId === 0
            ? response.data
            : response.data.filter((job: Job) => job.printer_id === printerId)
        );
      } catch (err) {
        console.error("Error fetching data:", err);
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
      <div className="bg-white p-6 rounded-md shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Выбор принтера и даты</h2>
        <select
          value={printerId}
          onChange={(e) => setPrinterId(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
          required
        >
          <option value={0}>Все принтеры</option>
          {printers.map((printer: Printer) => (
            <option key={printer.id} value={printer.id}>
              {getDisplayName(printer.name, printer.id)}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
        />
      </div>
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Очередь заявок</h2>
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
                <td className="p-2">{job.printer_id}</td>
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
