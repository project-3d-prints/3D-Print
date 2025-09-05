// lib/api.ts (фрагмент для материалов)
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
  try {
    const response = await fetch("http://localhost:8000/materials/", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
      throw new Error((await response.text()) || "Failed to fetch materials");
    const data = await response.json();
    return Array.isArray(data) ? { data } : data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    return { data: [] };
  }
};

export const getMaterial = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8000/materials/${id}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
      throw new Error((await response.text()) || "Failed to fetch material");
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching material:", error);
    throw error;
  }
};

export const createMaterial = async (material: Omit<Material, "id">) => {
  try {
    const response = await fetch("http://localhost:8000/materials/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(material),
    });
    if (!response.ok)
      throw new Error((await response.text()) || "Failed to create material");
    return await response.json();
  } catch (error) {
    console.error("Error creating material:", error);
    throw error;
  }
};

export const updateMaterial = async (
  id: number,
  updates: { quantity_printer: number; quantity_storage: number }
) => {
  try {
    const response = await fetch(`http://localhost:8000/materials/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok)
      throw new Error((await response.text()) || "Failed to update material");
    return await response.json();
  } catch (error) {
    console.error("Error updating material:", error);
    throw error;
  }
};

export const getPrinters = async () => {
  try {
    const response = await fetch("http://localhost:8000/printers", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
      throw new Error((await response.text()) || "Failed to fetch printers");
    const data = await response.json();
    return Array.isArray(data) ? { data } : data;
  } catch (error) {
    console.error("Error fetching printers:", error);
    return { data: [] };
  }
};

export const createPrinter = async (printer: {
  name: string;
  status: string;
  owner: string;
}) => {
  try {
    const response = await fetch("http://localhost:8000/printers", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(printer),
    });
    if (!response.ok)
      throw new Error((await response.text()) || "Failed to create printer");
    return await response.json();
  } catch (error) {
    console.error("Error creating printer:", error);
    throw error;
  }
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
  const data = await response.json();
  return Array.isArray(data) ? { data } : data;
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
