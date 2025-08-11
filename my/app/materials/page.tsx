"use client";
import { useState, useEffect } from "react";
import { getMaterials, Material } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MaterialList() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    getMaterials()
      .then((res) => setMaterials(res.data))
      .catch((err) => console.error(err));
  }, [isAuthenticated, router]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Materials</h2>
      <ul className="space-y-2">
        {materials.map((material) => (
          <li key={material.id} className="p-2 border rounded bg-gray-50">
            Material #{material.id}: {material.name}, Quantity:{" "}
            {material.quantity}g (Printer #{material.printer_id})
            <Link
              href={`/materials/update/${material.id}`}
              className="ml-2 text-blue-500 hover:underline"
            >
              Update
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
