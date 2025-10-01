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
}

export interface Job {
  id: number;
  printer_id: number;
  duration: number;
  deadline: string;
  material_amount: number;
  material_id: number;
  user: string;
  date: string;
  priority: number;
  warning?: string;
  material?: string;
}

export interface JobCreate {
  printer_id: number;
  duration: number;
  deadline: string;
  material_amount: number;
  material_id: string;
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
      throw new Error(errorText || "Failed to fetch materials");
    }
    const data = await response.json();
    console.log("Materials data:", data);
    return Array.isArray(data) ? { data } : { data: [data] };
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
    if (!response.ok) throw new Error("Failed to fetch material");
    const data = await response.json();
    return {
      data: {
        ...data,
        type: data.name.toLowerCase().includes("pla") ? "plastic" : "resin",
      },
    };
  } catch (error) {
    console.error("Error fetching material:", error);
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
    if (!response.ok) throw new Error("Failed to create material");
    const data = await response.json();
    return {
      ...data,
      type: data.name.toLowerCase().includes("pla") ? "plastic" : "resin",
    };
  } catch (error) {
    console.error("Error creating material:", error);
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
    if (!response.ok) throw new Error("Failed to update material");
    const data = await response.json();
    return data;
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
    if (!response.ok) throw new Error("Failed to fetch printers");
    const data = await response.json();
    return Array.isArray(data) ? { data } : { data: [data] };
  } catch (error) {
    console.error("Error fetching printers:", error);
    return { data: [] };
  }
};

export const getPrinter = async (printerId: number) => {
  try {
    console.log(
      `Fetching printer ${printerId} from http://localhost:8000/printers/${printerId}`
    );
    const response = await fetch(
      `http://localhost:8000/printers/${printerId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Printer response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch printer");
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching printer:", error);
    throw error;
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
    if (!response.ok) throw new Error("Failed to create printer");
    return await response.json();
  } catch (error) {
    console.error("Error creating printer:", error);
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
    const response = await fetch("http://localhost:8000/printers/", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ printer_id, quantity_printer }),
    });
    console.log("Printer update response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update printer quantity");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating printer quantity:", error);
    throw error;
  }
};

export const getQueue = async (printerId: number, day: string) => {
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
      throw new Error(errorText || "Failed to fetch queue");
    }
    const data: Job[] = await response.json();
    console.log("Queue response data:", data);
    // Обрабатываем material как строку
    const transformedData = data.map((job) => {
      console.log(`Material data for job ${job.id}:`, job.material);
      return {
        ...job,
        material:
          typeof job.material === "string"
            ? job.material
            : `Material ID: ${job.material_id}`,
      };
    });
    console.log("Transformed jobs:", transformedData);
    return { data: transformedData };
  } catch (error) {
    console.error("Error fetching queue:", error);
    throw error;
  }
};

export const createJob = async (job: JobCreate) => {
  try {
    console.log("Sending POST /jobs/ with data:", job);
    const response = await fetch("http://localhost:8000/jobs/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    console.log("Create job response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Create job error response:", errorText);
      throw new Error(errorText || "Failed to create job");
    }
    const data = await response.json();
    console.log("Create job response data:", data);
    return data;
  } catch (error) {
    console.error("Error creating job:", error);
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
    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
  } catch (error) {
    console.error("Error registering:", error);
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
    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();
    return { ...data, role: data.role || "студент" };
  } catch (error) {
    console.error("Error logging in:", error);
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
    console.error("Error checking session:", error);
    return { isValid: false, role: null, username: null };
  }
};
