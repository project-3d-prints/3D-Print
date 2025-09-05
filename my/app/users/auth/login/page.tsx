"use client";

import { useState } from "react";
import { login } from "../../../../lib/api";
import { useAuthStore } from "../../../../lib/store";
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
      console.log("Login response:", response); // Для отладки
      if (response.token && response.role) {
        setAuth({ token: response.token, role: response.role, username }); // Передаём введённый username
        toast.success("Вход выполнен!");
        router.push("/dashboard");
      } else {
        toast.error("Неожиданный ответ сервера");
      }
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      toast.error("Не удалось войти в аккаунт: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-cyan-800 mb-6">Авторизация</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-cyan-700"
            >
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="Введите имя пользователя"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-cyan-700"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-700 focus:border-cyan-700"
              placeholder="Введите пароль"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Link
              href="/users/auth/register"
              className="px-4 py-2 text-cyan-600 hover:text-cyan-800"
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
