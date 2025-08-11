"use client";
import { useState, useEffect } from "react";
import { getPrinters, Printer } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PrinterList() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Printers</h2>
      {user?.role === "lab_head" && (
        <Link
          href="/printers/create"
          className="inline-block mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Add Printer
        </Link>
      )}
      <ul className="space-y-2">
        {printers.map((printer) => (
          <li key={printer.id} className="p-2 border rounded bg-gray-50">
            Printer #{printer.id}: {printer.name} (Created by {printer.username}
            )
          </li>
        ))}
      </ul>
    </div>
  );
}
