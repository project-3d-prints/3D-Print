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
  owner: string; // Добавлено поле owner
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
  // Проверяем, есть ли данные в localStorage, и инициализируем, если нет
  let jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
  if (!Array.isArray(jobs)) {
    jobs = [];
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }

  const filteredJobs =
    printerId === 0
      ? jobs
      : jobs.filter(
          (j: Job) =>
            j.printer_id === printerId && (!day || j.date.includes(day))
        );

  return {
    data: filteredJobs,
  };
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
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find((u: any) => u.username === data.username)) {
    throw new Error("Username already exists");
  }
  const newUser = { id: users.length + 1, ...data };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  return { data: newUser };
};

export const login = async (username: string, password: string) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(
    (u: any) => u.username === username && u.password === password
  );
  if (!user) {
    throw new Error("Invalid username or password");
  }
  return { data: user };
};
