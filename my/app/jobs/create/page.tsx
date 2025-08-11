"use client";
import { useState, useEffect } from "react";
import { createJob, getPrinters, Printer } from "../../../lib/api";
import { useAuthStore } from "../../../lib/store";
import { useRouter } from "next/navigation";

interface JobFormState {
  printerId: string;
  duration: string;
  deadline: string;
  materialAmount: string;
  error: string;
}

export default function CreateJob() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [state, setState] = useState<JobFormState>({
    printerId: "",
    duration: "",
    deadline: "",
    materialAmount: "",
    error: "",
  });
  const [printers, setPrinters] = useState<Printer[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    getPrinters()
      .then((res) => setPrinters(res.data))
      .catch((err) => console.error(err));
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob({
        printer_id: Number(state.printerId),
        duration: Number(state.duration),
        deadline: state.deadline,
        material_amount: Number(state.materialAmount),
      });
      router.push("/jobs");
    } catch (err: any) {
      setState({
        ...state,
        error: err.response?.data?.detail || "Failed to create job",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={state.printerId}
          onChange={(e) => setState({ ...state, printerId: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Printer</option>
          {printers.map((printer) => (
            <option key={printer.id} value={printer.id}>
              {printer.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Duration (hours)"
          value={state.duration}
          onChange={(e) => setState({ ...state, duration: e.target.value })}
          step="0.1"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          placeholder="Deadline"
          value={state.deadline}
          onChange={(e) => setState({ ...state, deadline: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Material Amount (g)"
          value={state.materialAmount}
          onChange={(e) =>
            setState({ ...state, materialAmount: e.target.value })
          }
          step="0.1"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Create Job
        </button>
      </form>
    </div>
  );
}
