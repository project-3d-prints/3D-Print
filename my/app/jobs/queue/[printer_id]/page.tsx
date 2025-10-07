"use client";

import { useState, useEffect } from "react";
import { getQueue, getPrinters } from "../../../../lib/api";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../LoadingSpinner";
import AuthGuard from "../../../AuthGuard";

export default function JobQueue() {
  const params = useParams();
  const router = useRouter();
  const [printerId, setPrinterId] = useState<number>(0);
  const [jobs, setJobs] = useState<
    {
      id: number;
      user_id: number;
      user: string;
      printer_id: number;
      duration: number;
      deadline: string;
      created_at: string;
      material_amount: number;
      priority: number;
      file_path?: string | null;
      warning?: boolean;
      description: string;
    }[]
  >([]);
  const [printers, setPrinters] = useState<
    {
      id: number;
      name: string;
      type: string;
      quantity_material: number;
      username: string;
    }[]
  >([]);
  const [day, setDay] = useState<string>("");
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingJobs, setDownloadingJobs] = useState<{
    [key: number]: boolean;
  }>({});

  const getCleanFileName = (
    filePath: string | null | undefined
  ): string | null => {
    if (!filePath) return null;
    const cleanPath = filePath.split("?")[0];
    const fileName = cleanPath.split("/").pop();
    return fileName || null;
  };

  const handleDownload = async (jobId: number) => {
    setDownloadingJobs((prev) => ({ ...prev, [jobId]: true }));
    try {
      const response = await fetch(
        `http://localhost:8000/jobs/download/${jobId}/file`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Не удалось скачать файл");
      }
      const jobItem = jobs.find((job) => job.id === jobId);
      const fileName =
        getCleanFileName(jobItem?.file_path) || `model_${jobId}.obj`;
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("Файл скачан успешно");
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      toast.error("Не удалось скачать файл");
    } finally {
      setDownloadingJobs((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const printersResponse = await getPrinters();
        console.log("Fetched printers:", printersResponse.data);
        const fetchedPrinters = printersResponse.data || [];
        setPrinters(fetchedPrinters);

        const paramPrinterId = Number(params.printer_id);
        const selectedPrinterId = fetchedPrinters.some(
          (p: any) => p.id === paramPrinterId
        )
          ? paramPrinterId
          : 0;

        if (paramPrinterId !== selectedPrinterId) {
          router.replace(`/jobs/queue/0`);
          setPrinterId(0);
        } else {
          setPrinterId(selectedPrinterId);
        }

        const response = await getQueue(selectedPrinterId, day);
        console.log("Fetched jobs:", response.data);
        const sortedJobs = response.data.sort(
          (a: any, b: any) => a.priority - b.priority
        );
        setJobs(sortedJobs);
        console.log("Final jobs:", sortedJobs);
      } catch (err: any) {
        console.error("Ошибка загрузки данных:", err.message);
        toast.error("Ошибка при загрузке данных");
        setJobs([]);
        setPrinters([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [params.printer_id, day, router]);

  const getDisplayName = (name: string, id: number) => {
    const nameCount = printers.filter((p) => p.name === name).length;
    if (nameCount > 1) {
      const idCount = printers.filter(
        (p) => p.name === name && p.id <= id
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

  const handlePrinterChange = (newPrinterId: number) => {
    setPrinterId(newPrinterId);
    router.push(`/jobs/queue/${newPrinterId}`);
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
                onChange={(e) => handlePrinterChange(Number(e.target.value))}
                className="form-input"
              >
                <option value={0}>Все принтеры</option>
                {printers.map((printer) => (
                  <option key={printer.id} value={printer.id}>
                    {getDisplayName(printer.name, printer.id)} (
                    {printer.type === "plastic" ? "Пластик" : "Смола"},{" "}
                    {printer.quantity_material} г/мл)
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
            <div className="text-sm text-cyan-600 bg-gray-100 px-3 py-1 rounded">
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
              jobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                const isDownloading = downloadingJobs[job.id] || false;
                const { bg, text } = getPriorityStyles(job.priority);
                const printer = printers.find((p) => p.id === job.printer_id);
                const fileName = getCleanFileName(job.file_path);

                return (
                  <div
                    key={job.id}
                    className="card cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                    onClick={() => toggleJobExpansion(job.id)}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${bg} rounded-l-md transition-colors duration-300`}
                    ></div>

                    <div className="ml-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-cyan-800 text-sm">
                          #{job.id}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${bg} text-white transition-colors duration-300`}
                        >
                          {text}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Принтер:</span>{" "}
                          {printer
                            ? getDisplayName(printer.name, printer.id)
                            : `ID: ${job.printer_id}`}
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

                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          isExpanded
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-sm max-h-64 overflow-y-auto">
                          <p>
                            <span className="font-medium">Дата:</span>{" "}
                            {job.deadline || "Не указана"}
                          </p>
                          <p>
                            <span className="font-medium">
                              Количество материала:
                            </span>{" "}
                            {job.material_amount} г/мл
                          </p>
                          {job.description && (
                            <div>
                              <span className="font-medium">Описание:</span>
                              <div className="mt-1 p-2 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
                                <p className="text-sm whitespace-pre-wrap break-words">
                                  {job.description}
                                </p>
                              </div>
                            </div>
                          )}
                          {fileName && (
                            <p>
                              <span className="font-medium">Файл:</span>{" "}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(job.id);
                                }}
                                disabled={isDownloading}
                                className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                title={fileName}
                              >
                                {isDownloading ? "Скачивание..." : fileName}
                              </button>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-2">
                        <svg
                          className={`w-4 h-4 text-cyan-600 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
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
