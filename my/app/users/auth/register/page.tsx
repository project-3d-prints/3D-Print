"use client";

import { useState } from "react";
import { register } from "../../../../lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("студент");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || password.length < 6) {
      toast.error(
        "Пожалуйста, введите имя пользователя и пароль (минимум 6 символов)"
      );
      return;
    }
    try {
      console.log("Sending registration data:", { username, role, password });
      const response = await register({ username, role, password });
      console.log("Registration response:", response);
      toast.success("Регистрация прошла успешно!");
      window.location.href = "/users/auth/login";
    } catch (error: any) {
      console.error("Ошибка регистрации:", error.message);
      toast.error(`Ошибка регистрации: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-cyan-800 mb-6">Регистрация</h1>
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              placeholder="Введите имя пользователя"
              required
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-cyan-700"
            >
              Роль
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              required
            >
              <option value="студент">Студент</option>
              <option value="учитель">Учитель</option>
              <option value="глава лаборатории">Глава лаборатории</option>
            </select>
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
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
              placeholder="Введите пароль"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Link
              href="/users/auth/login"
              className="px-4 py-2 text-cyan-600 hover:text-cyan-800"
            >
              Уже есть аккаунт? Войти
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
