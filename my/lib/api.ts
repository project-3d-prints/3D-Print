"use client";

export interface Material {
  id?: number;
  name: string;
  quantity_storage: number;
  type?: "plastic" | "resin";
}

export interface Printer {
  id: number;
  name: string;
  type: "plastic" | "resin";
  quantity_material: number;
  username: string;
  warning?: string;
}

export interface Job {
  id: number;
  user_id: number;
  user: string;
  printer_id: number;
  duration: number;
  deadline: string; // ISO date string (e.g., "2025-10-03")
  created_at: string; // ISO date string
  material_amount: number;
  priority: number; // Integer (1=high, 2=medium, 3=low)
  material_id: number | null;
  material: string;
  file_path?: string | null;
  warning?: string;
}

export interface JobCreate {
  printer_id: number;
  duration: number;
  deadline: string;
  material_amount: number;
  material_id: number; // Теперь обязательное поле
}

export const getMaterials = async () => {
  try {
    console.log("Fetching materials from http://localhost:8000/materials");
    const response = await fetch("http://localhost:8000/materials", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Materials response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Materials error response:", errorText);
      throw new Error(errorText || "Не удалось загрузить материалы");
    }
    const data = await response.json();
    console.log("Materials data:", data);
    return Array.isArray(data) ? { data } : { data: [data] };
  } catch (error) {
    console.error("Ошибка загрузки материалов:", error);
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
    if (!response.ok) throw new Error("Не удалось загрузить материал");
    const data = await response.json();
    return {
      data: {
        ...data,
        type: data.name.toLowerCase().includes("pla") ? "plastic" : "resin",
      },
    };
  } catch (error) {
    console.error("Ошибка загрузки материала:", error);
    throw error;
  }
};

export const createMaterial = async (
  material: Omit<Material, "id" | "type">
) => {
  try {
    const response = await fetch("http://localhost:8000/materials/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: material.name,
        quantity_storage: material.quantity_storage,
      }),
    });
    if (!response.ok) throw new Error("Не удалось создать материал");
    const data = await response.json();
    return {
      ...data,
      type: data.name.toLowerCase().includes("pla") ? "plastic" : "resin",
    };
  } catch (error) {
    console.error("Ошибка создания материала:", error);
    throw error;
  }
};

export const updateMaterial = async (
  id: number,
  updates: { quantity_storage: number | null }
) => {
  try {
    const response = await fetch(`http://localhost:8000/materials/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Не удалось обновить материал");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка обновления материала:", error);
    throw error;
  }
};

export const getPrinters = async () => {
  try {
    const response = await fetch("http://localhost:8000/printers/", {
      // Завершающий слеш
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Не удалось загрузить принтеры");
    const data = await response.json();
    return Array.isArray(data) ? { data } : { data: [data] };
  } catch (error) {
    console.error("Ошибка загрузки принтеров:", error);
    return { data: [] };
  }
};

export const getPrinter = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8000/printers/${id}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Не удалось загрузить принтер");
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Ошибка загрузки принтера:", error);
    return { data: null };
  }
};

export const createPrinter = async (printer: {
  name: string;
  type: "plastic" | "resin";
  quantity_material: number;
  username: string;
}) => {
  try {
    const response = await fetch("http://localhost:8000/printers", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(printer),
    });
    if (!response.ok) throw new Error("Не удалось создать принтер");
    return await response.json();
  } catch (error) {
    console.error("Ошибка создания принтера:", error);
    throw error;
  }
};

export const updatePrinterQuantity = async ({
  printer_id,
  quantity_printer,
}: {
  printer_id: number;
  quantity_printer: number;
}) => {
  try {
    console.log(
      `Updating printer ${printer_id} with quantity ${quantity_printer}`
    );
    const response = await fetch(
      `http://localhost:8000/printers/${printer_id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printer_id, quantity_printer }), // Добавлено printer_id
      }
    );
    console.log("Printer update response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Не удалось обновить количество материала");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка обновления количества материала:", error);
    throw error;
  }
};

export const getQueue = async (printerId: number, day: string = "") => {
  const url = `/jobs/queue/${printerId}${day ? `?day=${day}` : ""}`;
  try {
    console.log(`Fetching queue from http://localhost:8000${url}`);
    const response: Response = await fetch(`http://localhost:8000${url}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Queue response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Queue error response:", errorText);
      throw new Error(errorText || "Не удалось загрузить очередь");
    }
    const data: Job[] = await response.json();
    console.log("Queue response data:", data);
    const transformedData = data.map((job) => ({
      ...job,
      material:
        typeof job.material === "string"
          ? job.material
          : `Material ID: ${job.material_id || "не указан"}`,
      warning: job.material_amount > 0 ? undefined : "Недостаточно материала",
    }));
    console.log("Transformed jobs:", transformedData);
    return { data: transformedData };
  } catch (error) {
    console.error("Ошибка загрузки очереди:", error);
    throw error;
  }
};

export const createJob = async ({
  job,
  file,
}: {
  job: JobCreate;
  file: File | null;
}) => {
  try {
    console.log("Sending POST /jobs/ with data:", job);
    const formData = new FormData();

    // поля как form data
    formData.append("printer_id", job.printer_id.toString());
    formData.append("duration", job.duration.toString());
    formData.append("deadline", job.deadline);
    formData.append("material_amount", job.material_amount.toString());
    formData.append("material_id", job.material_id.toString()); 

    if (file) {
      formData.append("file", file);
    }

    const response = await fetch("http://localhost:8000/jobs/", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    console.log("Create job response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Create job error response:", errorText);
      throw new Error(errorText || "Не удалось создать заявку");
    }
    const data = await response.json();
    console.log("Create job response data:", data);
    return data;
  } catch (error) {
    console.error("Ошибка создания заявки:", error);
    throw error;
  }
};

export const register = async (data: {
  username: string;
  role: string;
  password: string;
}) => {
  try {
    const response = await fetch("http://localhost:8000/users/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Не удалось зарегистрироваться");
    return await response.json();
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  try {
    const response = await fetch("http://localhost:8000/users/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Не удалось войти");
    const data = await response.json();
    return { ...data, role: data.role || "студент" };
  } catch (error) {
    console.error("Ошибка входа:", error);
    throw error;
  }
};

export const checkSession = async () => {
  try {
    console.log("Checking session with GET /jobs/queue/0");
    const response = await fetch("http://localhost:8000/jobs/queue/0", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Session check response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Session check error response:", errorText);
      return { isValid: false, role: null, username: null };
    }

    const roleCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_role="));
    const usernameCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="));

    const role = roleCookie
      ? decodeURIComponent(roleCookie.split("=")[1])
      : null;
    const username = usernameCookie
      ? decodeURIComponent(usernameCookie.split("=")[1])
      : null;

    return { isValid: true, role, username };
  } catch (error) {
    console.error("Ошибка проверки сессии:", error);
    return { isValid: false, role: null, username: null };
  }
};
