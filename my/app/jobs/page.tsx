"use client";
import { useState, useEffect } from "react";
import { getQueue, getPrinters, Printer, Job } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JobList() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    getPrinters()
      .then((res) => setPrinters(res.data))
      .catch((err) => console.error(err));
  }, [isAuthenticated, router]);

  const loadQueue = async () => {
    if (!selectedPrinter) return;
    try {
      const res = await getQueue(Number(selectedPrinter), day || null);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Queue</h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <select
          value={selectedPrinter}
          onChange={(e) => setSelectedPrinter(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Printer</option>
          {printers.map((printer) => (
            <option key={printer.id} value={printer.id}>
              {printer.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={loadQueue}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Load Queue
        </button>
      </div>
      <Link
        href="/jobs/create"
        className="inline-block mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Create Job
      </Link>
      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id} className="p-2 border rounded bg-gray-50">
            Job #{job.id}: Printer {job.printer_id}, Duration: {job.duration}h,
            Deadline: {job.deadline}, Material: {job.material_amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
