"use client";

import { useState, useEffect } from "react";
import { getPrinters, createJob } from "../../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store";
import AuthGuard from "../../AuthGuard";
import LoadingSpinner from "../../LoadingSpinner";

export default function CreateJob() {
  const [printers, setPrinters] = useState<
    { id: number; name: string; type: string; quantity_material: number }[]
  >([]);
  const [printerId, setPrinterId] = useState(0);
  const [duration, setDuration] = useState(0.0);
  const [deadline, setDeadline] = useState("");
  const [materialAmount, setMaterialAmount] = useState(0.0);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
  const ALLOWED_EXTENSIONS = [".stl", ".obj", ".3mf"];

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const printersResponse = await getPrinters();
        console.log("Printers:", printersResponse.data);
        setPrinters(printersResponse.data || []);
      } catch (err: any) {
        console.error("Ошибка загрузки данных:", err.message);
        toast.error("Ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const ext = selectedFile.name
        .slice(selectedFile.name.lastIndexOf("."))
        .toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        toast.error(
          "Недопустимый формат файла. Допустимые форматы: .stl, .obj, .3mf"
        );
        setFile(null);
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("Файл слишком большой. Максимальный размер: 100 MB");
        setFile(null);
        return;
      }
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (printerId === 0) {
      toast.error("Выберите принтер!");
      return;
    }
    if (materialAmount <= 0) {
      toast.error("Количество материала должно быть больше 0!");
      return;
    }
    if (duration <= 0) {
      toast.error("Длительность должна быть больше 0!");
      return;
    }
    const selectedPrinter = printers.find((p) => p.id === printerId);
    if (!selectedPrinter) {
      toast.error("Принтер не найден!");
      return;
    }
    if (selectedPrinter.quantity_material < materialAmount) {
      toast.error(
        `Недостаточно материала в принтере: доступно ${selectedPrinter.quantity_material} г/мл, требуется ${materialAmount} г/мл`
      );
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (deadline < today) {
      toast.error("Дедлайн должен быть в будущем!");
      return;
    }
    try {
      setIsLoading(true);
      await createJob({
        job: {
          printer_id: printerId,
          duration,
          deadline,
          material_amount: materialAmount,
          description,
        },
        file,
      });
      toast.success("Заявка успешно создана!");
      router.push("/jobs/queue/0");
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast.error(
        error.message.includes("Недопустимый формат файла")
          ? "Недопустимый формат файла. Допустимые форматы: .stl, .obj, .3mf"
          : error.message.includes("Файл слишком большой")
          ? "Файл слишком большой. Максимальный размер: 100 MB"
          : "Не удалось создать заявку"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Загружаем данные..." />;
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-cyan-800 mb-6">
          Создать заявку
        </h1>

        <div className="card max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Принтер
              </label>
              <select
                value={printerId}
                onChange={(e) => setPrinterId(Number(e.target.value))}
                className="form-input"
                required
              >
                <option value={0}>Выберите принтер</option>
                {printers.map((printer) => (
                  <option key={printer.id} value={printer.id}>
                    {printer.name} (
                    {printer.type === "plastic" ? "Пластик" : "Смола"},{" "}
                    {printer.quantity_material} г/мл)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Количество материала (г/мл)
              </label>
              <input
                type="number"
                step="0.1"
                value={materialAmount}
                onChange={(e) =>
                  setMaterialAmount(parseFloat(e.target.value) || 0.0)
                }
                className="form-input"
                placeholder="0.0"
                min="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Длительность (ч)
              </label>
              <input
                type="number"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value) || 0.0)}
                className="form-input"
                placeholder="0.0"
                min="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Дедлайн
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Описание заявки
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input min-h-[80px]"
                placeholder="Опишите детали вашей заявки..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Файл модели
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">
                      Нажмите для выбора файла
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    STL, OBJ, 3MF (до 100 МБ)
                  </p>
                </div>
                <input
                  type="file"
                  accept=".stl,.obj,.3mf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {file && (
                <p className="mt-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                  ✅ Выбран файл:{" "}
                  <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Создание..." : "Создать заявку"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
