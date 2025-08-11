import axios from "axios";

export interface User {
  username: string;
  role: "student" | "teacher" | "lab_head";
}

export interface Job {
  id: number;
  printer_id: number;
  duration: number;
  deadline: string;
  material_amount: number;
}

export interface Printer {
  id: number;
  name: string;
  username: string;
}

export interface Material {
  id: number;
  name: string;
  quantity: number;
  printer_id: number;
}

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : "http://web:8000",
  withCredentials: true,
});

export const login = async (username: string, password: string) => {
  return api.post<{ token: string }>("/users/auth/login", {
    username,
    password,
  });
};

export const getCurrentUser = async () => {
  return api.get<User>("/users/auth/me");
};

export const register = async (
  username: string,
  password: string,
  role: string
) => {
  return api.post("/users/auth/register", { username, password, role });
};

export const createJob = async (jobData: {
  printer_id: number;
  duration: number;
  deadline: string;
  material_amount: number;
}) => {
  return api.post<Job>("/jobs", jobData);
};

export const getQueue = async (printerId: number, day: string | null) => {
  return api.get<Job[]>(`/jobs/queue/${printerId}`, { params: { day } });
};

export const getPrinters = async () => {
  return api.get<Printer[]>("/printers");
};

export const createPrinter = async (name: string) => {
  return api.post<Printer>("/printers", { name });
};

export const getMaterials = async () => {
  return api.get<Material[]>("/materials");
};

export const createMaterial = async (materialData: {
  name: string;
  quantity: number;
  printer_id: number;
}) => {
  return api.post<Material>("/materials", materialData);
};

export const updateMaterial = async (materialId: number, quantity: number) => {
  return api.patch<Material>(`/materials/${materialId}`, { quantity });
};
