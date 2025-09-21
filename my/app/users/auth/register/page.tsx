"use client";

import { useState } from "react";
import { register } from "../../../../lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("студент");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || password.length < 6) {
      toast.error(
        "Пожалуйста, введите имя пользователя и пароль (минимум 6 символов)"
      );
      return;
    }

    setIsLoading(true);
    try {
      await register({ username, role, password });
      toast.success("Регистрация прошла успешно!");
      window.location.href = "/users/auth/login";
    } catch (error: any) {
      console.error("Ошибка регистрации:", error.message);
      toast.error("Ошибка регистрации. Попробуйте другое имя пользователя.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-800">3D Print</h1>
          <h2 className="mt-2 text-2xl font-bold text-cyan-900">Регистрация</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Введите имя пользователя"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Роль
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="студент">Студент</option>
                <option value="учитель">Учитель</option>
                <option value="глава лаборатории">Глава лаборатории</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Введите пароль (мин. 6 символов)"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </button>

            <div className="text-center">
              <Link
                href="/users/auth/login"
                className="text-cyan-600 hover:text-cyan-800 text-sm"
              >
                Уже есть аккаунт? Войти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
