// lib/api.ts
export interface Material {
  id?: number;
  name: string;
  printer_id: number;
  quantity_printer: number;
  quantity_storage: number;
}

export interface Printer {
  id: number;
  name: string;
  status: string;
  owner: string;
}

export interface Job {
  id: number;
  printer_id: number;
  duration: number;
  deadline: string;
  material_amount: number;
  user: string;
  date: string;
  material: string;
  priority: number;
}

export const getMaterials = async () => {
  const materials = JSON.parse(localStorage.getItem("materials") || "[]");
  return { data: materials };
};

export const getMaterial = async (id: number) => {
  const materials = JSON.parse(localStorage.getItem("materials") || "[]");
  const material = materials.find((m: Material) => m.id === id);
  return { data: material || { quantity_printer: 0, quantity_storage: 0 } };
};

export const createMaterial = async (material: Omit<Material, "id">) => {
  const materials = JSON.parse(localStorage.getItem("materials") || "[]");
  const newMaterial = { ...material, id: materials.length + 1 };
  materials.push(newMaterial);
  localStorage.setItem("materials", JSON.stringify(materials));
  return { data: newMaterial };
};

export const updateMaterial = async (
  id: number,
  updates: { quantity_printer: number; quantity_storage: number }
) => {
  let materials = JSON.parse(localStorage.getItem("materials") || "[]");
  materials = materials.map((m: Material) =>
    m.id === id ? { ...m, ...updates } : m
  );
  localStorage.setItem("materials", JSON.stringify(materials));
  return { data: { id, ...updates } };
};

export const getPrinters = async () => {
  const printers = JSON.parse(localStorage.getItem("printers") || "[]");
  return { data: printers };
};

export const createPrinter = async (printer: {
  name: string;
  status: string;
  owner: string;
}) => {
  const printers = JSON.parse(localStorage.getItem("printers") || "[]");
  const newPrinter = { id: printers.length + 1, ...printer };
  printers.push(newPrinter);
  localStorage.setItem("printers", JSON.stringify(printers));
  return { data: newPrinter };
};

export const getQueue = async (printerId: number, day: string) => {
  const url = `/jobs/queue/${printerId}${day ? `?day=${day}` : ""}`;
  const response = await fetch(`http://localhost:8000${url}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok)
    throw new Error((await response.text()) || "Failed to fetch queue");
  return response.json();
};

export const createJob = async (job: Omit<Job, "id">) => {
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
  const newJob = {
    ...job,
    id: jobs.length + 1,
    date: new Date().toISOString().split("T")[0],
  };
  jobs.push(newJob);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  return { data: newJob };
};

export const register = async (data: {
  username: string;
  role: string;
  password: string;
}) => {
  const response = await fetch("http://localhost:8000/users/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Регистрация не удалась");
  }
  return response.json();
};

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch("http://localhost:8000/users/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData) || "Login failed");
  }
  return response.json();
};
