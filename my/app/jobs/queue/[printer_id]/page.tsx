"use client";

import { useState, useEffect } from "react";
import { getQueue, getPrinters } from "../../../../lib/api";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../LoadingSpinner";
import AuthGuard from "../../../AuthGuard";

interface Job {
  id: number;
  user: string;
  date: string;
  material: string;
  duration: number;
  priority: number;
  printer_id: number;
  warning?: string;
}

interface Printer {
  id: number;
  name: string;
  type: "plastic" | "resin";
  quantity_material: number;
  username: string;
}

export default function JobQueue() {
  const params = useParams();
  const [printerId, setPrinterId] = useState<number>(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [day, setDay] = useState<string>("");
  const [expandedJobs, setExpandedJobs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
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

        filteredJobs.sort((a: Job, b: Job) => a.priority - b.priority);
        setJobs(filteredJobs);
      } catch (err: any) {
        console.error("Ошибка загрузки данных:", err.message);
        toast.error("Ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
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

  const getPriorityStyles = (priority: number) => {
    switch (priority) {
      case 1:
        return { bg: "bg-red-500", text: "Высокий" };
      case 2:
        return { bg: "bg-yellow-500", text: "Средний" };
      case 3:
        return { bg: "bg-gray-400", text: "Низкий" };
      default:
        return { bg: "bg-gray-400", text: "Не указан" };
    }
  };

  const formatDuration = (hours: number) => {
    if (Number.isInteger(hours)) {
      return `${hours} ч`;
    } else {
      const minutes = Math.round(hours * 60);
      return `${minutes} м`;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
          Очередь заявок
        </h1>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-cyan-700">Фильтры</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Принтер
              </label>
              <select
                value={printerId}
                onChange={(e) => setPrinterId(Number(e.target.value))}
                className="form-input"
              >
                <option value={0}>Все принтеры</option>
                {printers.map((printer: Printer) => (
                  <option key={printer.id} value={printer.id}>
                    {getDisplayName(printer.name, printer.id)} ({printer.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Дата
              </label>
              <input
                type="date"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-semibold text-cyan-700 mb-2 sm:mb-0">
              Все заявки
            </h2>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
              Найдено: {jobs.length} | Принтер:{" "}
              {printerId === 0
                ? "Все"
                : getDisplayName(
                    printers.find((p) => p.id === printerId)?.name || "",
                    printerId
                  )}
            </div>
          </div>

          <div className="grid-responsive">
            {jobs.length > 0 ? (
              jobs.map((job: Job) => {
                const isExpanded = expandedJobs[job.id] || false;
                const { bg, text } = getPriorityStyles(job.priority);
                const printer = printers.find((p) => p.id === job.printer_id);

                return (
                  <div
                    key={job.id}
                    className="card cursor-pointer transition-all duration-200 hover:shadow-lg relative"
                    onClick={() =>
                      setExpandedJobs((prev) => ({
                        ...prev,
                        [job.id]: !isExpanded,
                      }))
                    }
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${bg} rounded-l-md`}
                    ></div>

                    <div className="ml-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-cyan-800 text-sm">
                          #{job.id}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${bg} text-white`}
                        >
                          {text}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Принтер:</span>{" "}
                          {printer
                            ? getDisplayName(printer.name, printer.id)
                            : job.printer_id}
                        </p>
                        <p>
                          <span className="font-medium">Пользователь:</span>{" "}
                          {job.user || "Не указан"}
                        </p>
                        <p>
                          <span className="font-medium">Длительность:</span>{" "}
                          {formatDuration(job.duration)}
                        </p>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm">
                            <span className="font-medium">Дата:</span>{" "}
                            {job.date || "Не указана"}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Материал:</span>{" "}
                            {job.material || "Не указан"}
                          </p>
                          {job.warning && (
                            <p className="text-sm text-red-600">
                              <span className="font-medium">
                                Предупреждение:
                              </span>{" "}
                              {job.warning}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-4xl lg:text-6xl mb-4">📋</div>
                <p className="text-gray-500 text-lg mb-2">Нет заявок</p>
                <p className="text-gray-400 text-sm">
                  Попробуйте выбрать другую дату или принтер
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
