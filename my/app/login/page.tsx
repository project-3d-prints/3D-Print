"use client";

import { useState } from "react";
import { login } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      localStorage.setItem("authToken", response.data.token); // Сохраняем токен
      setAuth({ ...response.data, role: response.data.role });
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      toast.error("Failed to login");
    }
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Авторизация</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="e.g., john_doe"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Link
              href="/register"
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Нет аккаунта? Зарегистрироваться
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
