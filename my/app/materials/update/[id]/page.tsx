"use client";
import { useState, useEffect } from "react";
import { updateMaterial, getMaterials, Material } from "../../../../lib/api";
import { useAuthStore } from "../../../../lib/store";
import { useRouter, useParams } from "next/navigation";

interface MaterialFormState {
  quantity: string;
  error: string;
}

export default function UpdateMaterial() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const [state, setState] = useState<MaterialFormState>({
    quantity: "",
    error: "",
  });
  const [material, setMaterial] = useState<Material | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    getMaterials()
      .then((res) => {
        const mat = res.data.find((m) => m.id === Number(params.id));
        if (mat) {
          setMaterial(mat);
          setState({ ...state, quantity: mat.quantity.toString() });
        }
      })
      .catch((err) => console.error(err));
  }, [isAuthenticated, params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMaterial(Number(params.id), Number(state.quantity));
      router.push("/materials");
    } catch (err: any) {
      setState({
        ...state,
        error: err.response?.data?.detail || "Failed to update material",
      });
    }
  };

  if (!material) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Update Material: {material.name}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Quantity (g)"
          value={state.quantity}
          onChange={(e) => setState({ ...state, quantity: e.target.value })}
          step="0.1"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Update Material
        </button>
      </form>
    </div>
  );
}
