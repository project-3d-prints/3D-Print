"use client";
import { useState, useEffect } from "react";
import { createPrinter } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import { useRouter } from "next/navigation";

interface PrinterFormState {
  name: string;
  error: string;
}

export default function CreatePrinter() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [state, setState] = useState<PrinterFormState>({ name: "", error: "" });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "lab_head") {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPrinter(state.name);
      router.push("/printers");
    } catch (err: any) {
      setState({
        ...state,
        error: err.response?.data?.detail || "Failed to create printer",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Printer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Printer Name"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Create Printer
        </button>
      </form>
    </div>
  );
}
